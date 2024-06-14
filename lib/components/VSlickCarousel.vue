<template>
  <div
    :class="{ 'v-slick-vertical': settings.vertical }"
    class="v-slick-slider"
    dir="ltr"
  >
    <VSlickArrow v-if="settings.showDefaultArrows">
      <template v-slot:prevArrow="arrowSlotProps">
        <slot name="prevArrow" v-bind="arrowSlotProps"></slot>
      </template>
    </VSlickArrow>
    <div
      :class="{ 'v-slick-dragging': state.dragging }"
      class="v-slick-list"
      ref="vSlickListRef"
      :style="vSlickListStyle"
      @click="handleClickVSlickList"
      @mousedown="handleMouseDownVSlickList"
      @mouseup="handleMouseUpVSlickList"
      @mouseleave="handleMouseLeaveVSlickList"
      @mousemove="handleMouseMoveVSlickList"
      @touchstart.passive="handleTouchStartVSlickList"
      @touchmove.passive="handleTouchMoveVSlickList"
      @touchend="handleTouchEndVSlickList"
      @touchcancel="handleTouchCancelVSlickList"
      @keydown="handleKeyDownVSlickList"
    >
      <VSlickTrack ref="vSlickTrackRef"></VSlickTrack>
    </div>
    <VSlickArrow v-if="settings.showDefaultArrows">
      <template v-slot:nextArrow="arrowSlotProps">
        <slot name="nextArrow" v-bind="arrowSlotProps"></slot>
      </template>
    </VSlickArrow>
    <VSlickDots v-if="settings.showDefaultDots">
      <template v-slot:customPaging="paging">
        <slot name="customPaging" v-bind="paging"></slot>
      </template>
    </VSlickDots>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, VNode, useSlots, getCurrentInstance } from 'vue'
import {
  Props,
  SwipeDirection,
  SwipeEndSpec,
  SwipeMoveSpec,
  VSlickCarouselInstance
} from '@lib/types'
import {
  canUseDOM,
  filterUndefined,
  getChangedSlideGroupIndex
} from '@lib/utils'
import { defaultPropValues, defaultProps, defaultSliderState } from './props'
import enquireJs from 'enquire.js'
import json2mq from 'json2mq'
import VSlickArrow from './VSlickArrow.vue'
import VSlickTrack from './VSlickTrack.vue'
import cloneDeep from 'lodash.clonedeep'
import debounce from 'lodash.debounce'
import {
  extractSlides,
  getNavigationOnKeyType,
  getStatesOnSlideGroup,
  getSwipeEndState,
  getSwipeMoveState,
  getSwipeStartState
} from '@lib/utils/carousel-utils'
import {
  SwipeEvent,
  SlideNavigation,
  SlideGroupChangeOptions,
  SlideGroupChangeSpec,
  OnSlideSpec
} from '@lib/types'

const slots = useSlots()

const enquire = canUseDOM() ? enquireJs : undefined

const props = defineProps(defaultProps) as Props
defineOptions({ inheritAttrs: false })

const breakpoint = ref<number>()

const emit = defineEmits([
  'init',
  'beforeChange',
  'afterChange',
  'lazyLoad',
  'lazyLoadError',
  'reInit',
  'edge',
  'swipe'
])

const vSlickListRef = ref<HTMLElement>()
const vSlickTrackRef = ref<InstanceType<typeof VSlickTrack>>()

let triggerSlideGroupHandler: number | undefined
let animationEndCallback: NodeJS.Timeout | null = null
let lazyLoadTimer: NodeJS.Timeout | null = null
let callbackTimers: NodeJS.Timeout[] = []

const slideGroupCount = computed(() =>
  Math.ceil(slides.value.length / settings.value.slidesPerGroup)
)

const settings = computed<Props>(() => {
  const definedProps = filterUndefined(props)
  let settings = { ...defaultPropValues, ...definedProps }
  if (breakpoint.value) {
    const newProps = props.responsive.find(
      (item) => item.breakpoint === breakpoint.value
    )
    settings = {
      ...settings,
      ...newProps?.settings
    }
  }
  // force scrolling by one group if 'centerMode' is enabled
  if (settings.centerMode) {
    if (settings.groupsToScroll > 1 && process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn(
        `centerMode is enabled: groupsToScroll should be 1; you are using ${settings.groupsToScroll}`
      )
    }
    settings.groupsToScroll = 1
  }
  // force showing one group and scrolling by one if `fade` is enabled
  if (settings.fade) {
    if (settings.groupsToShow > 1 && process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn(
        `fade is enabled: groupsToShow should be 1; you are using ${settings.groupsToShow}`
      )
    }
    if (settings.groupsToScroll > 1 && process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn(
        `fade is enabled: groupsToScroll should be 1; you are using ${settings.groupsToScroll}`
      )
    }
    settings.groupsToShow = 1
    settings.groupsToScroll = 1
  }
  // force disabling `variableWidth` if `slidesPerGroup` is bigger than 1
  if (settings.slidesPerGroup > 1) {
    if (settings.variableWidth && process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn(`slidesPerGroup is bigger than 1: variableWidth is disabled`)
    }
    settings.variableWidth = false
  }

  return settings
})

const state = ref({
  ...cloneDeep(defaultSliderState),
  currentSlideGroupIndex: settings.value.initialGroupIndex
})

let responsiveMediaHandlers: {
  query: string
  handler: () => void
}[] = []

const media = (query: string, handler: () => void) => {
  if (!enquire) return

  enquire.register(query, handler)
  responsiveMediaHandlers.push({ query, handler })
}

const clearBreakpoints = () => {
  responsiveMediaHandlers.forEach(({ query, handler }) =>
    enquire?.unregister(query, handler)
  )
  responsiveMediaHandlers = []
}

const makeBreakpoints = () => {
  if (!props.responsive.length) return
  const breakpoints = props.responsive.map((item) => item.breakpoint)
  breakpoints.sort((a, b) => a - b)
  breakpoints.forEach((_breakpoint, index) => {
    const mediaQuery = json2mq({
      minWidth: index === 0 ? 0 : breakpoints[index - 1] + 1,
      maxWidth: _breakpoint
    })
    media(mediaQuery, () => {
      breakpoint.value = _breakpoint
    })
  })
  const query = json2mq({
    minWidth: breakpoints.slice(-1)[0]
  })
  media(query, () => {
    breakpoint.value = undefined
  })
}

watch(
  () => props,
  () => {
    clearBreakpoints()
    makeBreakpoints()
  },
  { deep: true }
)

makeBreakpoints()

const slides = ref<VNode[]>(
  slots.default
    ? extractSlides(slots.default(), settings.value.isSlidePredicate)
    : []
)

watch(
  () => [slots.default, settings.value.isSlidePredicate],
  ([newSlots, newIsSlidePredicate]) => {
    slides.value = newSlots
      ? extractSlides((newSlots as any)(), newIsSlidePredicate as any)
      : []
  }
)

const vSlickListStyle = {
  ...(getCurrentInstance()?.vnode?.props?.style || {})
}

let isVSlickListClickable = true
let debouncedResize: ReturnType<typeof debounce> | null = null
let ro: ResizeObserver | null = null

const handleClickVSlickList = (e: Event) => {
  if (isVSlickListClickable === false) {
    e.stopPropagation()
    e.preventDefault()
  }
  isVSlickListClickable = true
}

const keyHandler = (e: KeyboardEvent) => {
  const navigation = getNavigationOnKeyType(
    e,
    settings.value.accessibility,
    settings.value.rtl
  )
  navigation !== '' &&
    changeSlideGroup({ message: navigation as SlideNavigation })
}

const handleKeyDownVSlickList = computed(() =>
  settings.value.accessibility ? keyHandler : undefined
)

const swipeStart = (e: SwipeEvent) => {
  const swipeStartState = getSwipeStartState(
    e,
    settings.value.swipe,
    settings.value.draggable
  )
  Object.assign(state.value, swipeStartState)
}

const swipeEnd = (e: SwipeEvent) => {
  const swipeEndState = getSwipeEndState(e, {
    ...settings.value,
    ...state.value,
    trackEl: vSlickTrackRef.value?.$el,
    listEl: vSlickListRef.value,
    slideGroupIndex: state.value.currentSlideGroupIndex,
    slideGroupCount: slideGroupCount.value
  } as SwipeEndSpec)
  if (!swipeEndState) return
  const { triggerSlideGroupHandler: newTriggerSlideGroupHandler, ...rest } =
    swipeEndState
  triggerSlideGroupHandler = newTriggerSlideGroupHandler
  Object.assign(state.value, rest)
  if (triggerSlideGroupHandler) {
    slideGroupHandler(triggerSlideGroupHandler)
  }
}

const swipeMove = (e: SwipeEvent) => {
  const swipeMoveState = getSwipeMoveState(e, {
    ...props,
    ...state.value,
    trackEl: vSlickTrackRef.value?.$el,
    listEl: vSlickListRef.value,
    slideGroupIndex: state.value.currentSlideGroupIndex,
    slideGroupCount: slideGroupCount.value,
    onEdge: (e: SwipeDirection | keyof typeof SwipeDirection) =>
      emit('edge', e),
    swipeEvent: (e: SwipeDirection | keyof typeof SwipeDirection) =>
      emit('swipe', e)
  } as SwipeMoveSpec)
  if (!swipeMoveState) return
  if (swipeMoveState.swiping) {
    isVSlickListClickable = false
  }
  Object.assign(state.value, swipeMoveState)
}

const handleMouseDownVSlickList = computed(() =>
  settings.value.touchMove ? swipeStart : undefined
)

const handleTouchStartVSlickList = computed(() =>
  settings.value.touchMove ? swipeStart : undefined
)

const handleMouseUpVSlickList = computed(() =>
  settings.value.touchMove ? swipeEnd : undefined
)

const handleMouseLeaveVSlickList = computed(() =>
  state.value.dragging && settings.value.touchMove ? swipeEnd : undefined
)

const handleTouchEndVSlickList = computed(() =>
  settings.value.touchMove ? swipeEnd : undefined
)

const handleMouseMoveVSlickList = computed(() =>
  state.value.dragging && settings.value.touchMove ? swipeMove : undefined
)

const changeSlideGroup = (
  options: SlideGroupChangeOptions,
  dontAnimate = false
) => {
  const spec = {
    ...settings.value,
    ...state.value,
    slideGroupCount: slideGroupCount.value
  }
  const targetSlideGroupIndex = getChangedSlideGroupIndex(
    spec as SlideGroupChangeSpec,
    options
  )
  if (!targetSlideGroupIndex) return
  slideGroupHandler(
    targetSlideGroupIndex,
    dontAnimate === true ? true : undefined
  )
}

const slideGroupHandler = (index: number, dontAnimate = false) => {
  const { asNavFor, speed } = settings.value
  const currentSlideGroupIndex = state.value.currentSlideGroupIndex
  const { slidingState, afterSlidingState } = getStatesOnSlideGroup({
    index,
    ...settings.value,
    ...state.value,
    trackEl: vSlickTrackRef.value?.$el,
    useCSSTransitions: settings.value.useCSSTransitions && !dontAnimate
  } as OnSlideSpec)
  if (!slidingState) return
  emit(
    'beforeChange',
    currentSlideGroupIndex,
    slidingState.currentSlideGroupIndex
  )
  const slidesToLoad =
    slidingState.lazyLoadedList?.filter(
      (value: number) => state.value.lazyLoadedList.indexOf(value) < 0
    ) || []
  if (slidesToLoad.length) {
    emit('lazyLoad', slidesToLoad)
  }
  Object.assign(state.value, slidingState)
  if (asNavFor) {
    ;(asNavFor as VSlickCarouselInstance).goTo(index)
  }
  if (!afterSlidingState) return
  animationEndCallback = setTimeout(() => {
    const { animating, ...firstBatch } = afterSlidingState!
    Object.assign(state.value, firstBatch)
    callbackTimers.push(
      setTimeout(() => {
        state.value.animating = animating || false
      }, 10)
    )
    emit('afterChange', slidingState.currentSlideGroupIndex)
    animationEndCallback = null
  }, speed)
}

defineExpose({
  goTo: slideGroupHandler,
  next: () => {
    slideGroupHandler(
      state.value.currentSlideGroupIndex + settings.value.groupsToScroll
    )
  },
  prev: () => {
    slideGroupHandler(
      state.value.currentSlideGroupIndex - settings.value.groupsToScroll
    )
  },
  // play,
  // pause,
  // autoplay,
  state
})
</script>
