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
import { Props } from '@lib/types'
import { canUseDOM, filterUndefined } from '@lib/utils'
import { defaultPropValues, defaultProps, defaultSliderState } from './props'
import enquireJs from 'enquire.js'
import json2mq from 'json2mq'
import VSlickArrow from './VSlickArrow.vue'
import VSlickTrack from './VSlickTrack.vue'
import cloneDeep from 'lodash.clonedeep'
import debounce from 'lodash.debounce'
import ResizeObserver from 'resize-observer-polyfill'
import {
  extractSlides,
  getNavigationOnKeyType
} from '@lib/utils/carousel-utils'
import {
  SwipeEvent,
  SlideNavigation,
  SlideGroupChangeOptions,
  SlideGroupChangeSpec
} from '@lib/types'

const slots = useSlots()

const enquire = canUseDOM() ? enquireJs : undefined

const props = defineProps(defaultProps) as Props
defineOptions({ inheritAttrs: false })

const breakpoint = ref<number>()

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
  currentSlide: props.initialGroup
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
  slots.default ? extractSlides(slots.default(), props.isSlidePredicate) : []
)

watch(
  () => slots.default,
  () => {
    slides.value = slots.default
      ? extractSlides(slots.default(), props.isSlidePredicate)
      : []
  }
)

const vSlickListStyle = {
  ...(getCurrentInstance()?.vnode?.props?.style || {})
}

const changeSlideGroup = (
  options: SlideGroupChangeOptions,
  dontAnimate = false
) => {
  const spec = { ...props, ...state.value, slideCount: slideCount.value }
  const targetSlide = getChangedSlide(spec as SlideChangeSpec, options)
  if (targetSlide !== 0 && !targetSlide) return
  if (dontAnimate === true) {
    slideHandler(targetSlide, dontAnimate)
  } else {
    slideHandler(targetSlide)
  }
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
  const navigation = getNavigationOnKeyType(e, props.accessibility, props.rtl)
  navigation !== '' &&
    changeSlideGroup({ message: navigation as SlideNavigation })
}

const handleKeyDownVSlickList = computed(() =>
  props.accessibility ? keyHandler : undefined
)

const swipeStart = (e: SwipeEvent) => {
  const swipeStartState = getSwipeStartState(e, props.swipe, props.draggable)
  if (swipeStartState !== '') {
    Object.assign(state.value, swipeStartState)
  }
}

const changeSlideGroup = (
  options: SlideGroupChangeOptions,
  dontAnimate = false
) => {
  const spec = {
    ...props,
    ...state.value,
    slideGroupCount: slideGroupCount.value
  }
  const targetSlideGroupIndex = getChangedSlideGroupIndex(
    spec as SlideGroupChangeSpec,
    options
  )
  if (!targetSlideGroupIndex) return
  if (dontAnimate === true) {
    slideGroupHandler(targetSlideGroupIndex, dontAnimate)
  } else {
    slideGroupHandler(targetSlideGroupIndex)
  }
}
</script>
