<template>
  <div
    ref="vSlickCarouselRef"
    class="v-slick-carousel"
    :style="
      widthDetection === WidthDetection.manual
        ? state.detectingWidth
          ? { width: '100%' }
          : vSlickCarouselStyle
        : {}
    "
  >
    <div class="v-slick-slider" :dir="settings.rtl ? 'rtl' : 'ltr'">
      <VSlickArrow
        v-if="settings.arrows"
        :type="SlideNavigation.previous"
        :center-mode="settings.centerMode"
        :infinite="settings.infinite"
        :groups-to-show="settings.groupsToShow"
        :slide-group-count="slideGroupCount"
        :current-slide-group-index="state.currentSlideGroupIndex"
        :disabled="!canGoPrev"
        @previous="handlePrevVSlickArrow"
      >
        <template #prevArrow="arrowSlotProps">
          <slot name="prevArrow" v-bind="arrowSlotProps" />
        </template>
      </VSlickArrow>
      <div
        ref="vSlickListRef"
        class="v-slick-list"
        :class="{ dragging: state.dragging }"
        :style="vSlickListStyle"
        @click="handleClickVSlickList"
        @mousedown="handleMouseDownOrTouchStartVSlickList"
        @touchstart="handleMouseDownOrTouchStartVSlickList"
        @keydown="handleKeyDownVSlickList"
      >
        <VSlickTrack
          ref="vSlickTrackRef"
          :center-mode="settings.centerMode"
          :center-padding="settings.centerPadding"
          :raw-slide-groups="rawSlideGroups"
          :css-ease="cssEase"
          :current-slide-group-index="state.currentSlideGroupIndex"
          :detecting-width="state.detectingWidth"
          :fade="settings.fade"
          :ignore-prefers-reduced-motion="settings.ignorePrefersReducedMotion"
          :infinite="settings.infinite"
          :lazy-load="settings.lazyLoad"
          :lazy-loaded-list="state.lazyLoadedList"
          :list-height="state.listHeight"
          :rtl="settings.rtl"
          :slide-group-count="slideGroupCount"
          :slide-group-height="state.slideGroupHeight"
          :slide-group-width="state.slideGroupWidth"
          :groups-to-scroll="settings.groupsToScroll"
          :groups-to-show="settings.groupsToShow"
          :speed="settings.speed"
          :track-style="state.trackStyle"
          :variable-width="settings.variableWidth"
          :vertical="settings.vertical"
          @mouseenter="handleMouseEnterOrOverVSlickTrack"
          @mouseleave="handleMouseLeaveVSlickTrack"
          @mouseover="handleMouseEnterOrOverVSlickTrack"
          @child-click="handleChildClickVSlickTrack"
        />
      </div>
      <VSlickArrow
        v-if="settings.arrows"
        :type="SlideNavigation.next"
        :center-mode="settings.centerMode"
        :infinite="settings.infinite"
        :groups-to-show="settings.groupsToShow"
        :slide-group-count="slideGroupCount"
        :current-slide-group-index="state.currentSlideGroupIndex"
        :disabled="!canGoNext"
        @next="handleNextVSlickArrow"
      >
        <template #nextArrow="arrowSlotProps">
          <slot name="nextArrow" v-bind="arrowSlotProps" />
        </template>
      </VSlickArrow>
    </div>
    <VSlickDots
      v-if="settings.dots"
      :current-slide-group-index="state.currentSlideGroupIndex"
      :infinite="settings.infinite"
      :slide-group-count="slideGroupCount"
      :groups-to-scroll="settings.groupsToScroll"
      :groups-to-show="settings.groupsToShow"
      :page-count="pageCount"
      @dot-click="handleClickDot"
      @dots-over="handleOverDots"
      @dots-leave="handleLeaveDots"
    >
      <template #customPaging="paging">
        <slot name="customPaging" v-bind="paging" />
      </template>
    </VSlickDots>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  watch,
  VNode,
  useSlots,
  getCurrentInstance,
  onMounted,
  onBeforeUnmount,
  onUpdated
} from 'vue'
import {
  ChildClickPayload,
  DotClickPayload,
  LazyLoadType,
  PlayingType,
  Props,
  SwipeDirection,
  SwipeEndSpec,
  SwipeMoveSpec,
  TrackInfoSpec,
  VSlickCarouselInstance,
  SwipeEvent,
  SlideNavigation,
  SlideGroupChangeOptions,
  SlideGroupChangeSpec,
  OnSlideSpec,
  WidthDetection
} from '@lib/types'
import {
  canUseDOM,
  clearSelection,
  filterUndefined,
  getChangedSlideGroupIndex
} from '@lib/utils'
import {
  defaultPropValues,
  defaultProps,
  makeDefaultSliderState
} from './props'
import enquireJs from '@dcufo/enquire.js'
import json2mq from 'json2mq'
import VSlickArrow from './VSlickArrow.vue'
import VSlickTrack from './VSlickTrack.vue'
import VSlickDots from './VSlickDots.vue'
import debounce from 'lodash.debounce'
import {
  canGoNext as checkCanGoNext,
  canGoPrev as checkCanGoPrev,
  extractSlides,
  getNavigationOnKeyType,
  getOnDemandLazySlideGroups,
  getSlideGroupCount,
  getSliderState,
  getStatesOnSlide,
  getSwipeEndState,
  getSwipeMoveState,
  getSwipeStartState,
  getTotalPostClones,
  getTotalPreClones,
  getTrackCSS,
  getTrackLeft
} from '@lib/utils/carousel-utils'

const props = defineProps(defaultProps) as Props
defineOptions({ inheritAttrs: false })

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

const slots = useSlots()
const enquire = canUseDOM() ? enquireJs : undefined

const DEBOUNCE_RESIZE_DURATION = 50

let triggerSlideGroupHandler: number | undefined
let animationEndCallback: NodeJS.Timeout | null = null
let lazyLoadTimer: NodeJS.Timeout | null = null
let callbackTimers: NodeJS.Timeout[] = []

const vSlickListStyle = ref({
  ...(getCurrentInstance()?.vnode?.props?.style || {})
})

let isVSlickListClickable = true
let debouncedResize: ReturnType<typeof debounce> | null = null
let ro: ResizeObserver | null = null

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

const swipeStart = (e: SwipeEvent) => {
  // setTimout is used here to prevent disabling the scroll prematurely
  setTimeout(() => {
    e.preventDefault()
  })
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
  if (triggerSlideGroupHandler !== undefined) {
    slideGroupHandler(triggerSlideGroupHandler)
  }
}

const swipeMove = (e: SwipeEvent) => {
  clearSelection()
  const { swipeDirection, ...swipeMoveState } =
    getSwipeMoveState(e, {
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
    } as SwipeMoveSpec) || ({} as any)
  if (
    (settings.value.verticalSwiping && swipeDirection === SwipeDirection.up) ||
    swipeDirection === SwipeDirection.down ||
    (!settings.value.verticalSwiping &&
      swipeDirection === SwipeDirection.left) ||
    swipeDirection === SwipeDirection.right
  ) {
    e.preventDefault()
  }
  if (!swipeMoveState) return
  if (swipeMoveState.swiping) {
    isVSlickListClickable = false
  }
  Object.assign(state.value, swipeMoveState)
}

const play = () => {
  let nextIndex
  if (settings.value.rtl) {
    nextIndex =
      state.value.currentSlideGroupIndex - settings.value.groupsToScroll
  } else {
    if (canGoNext.value) {
      nextIndex =
        state.value.currentSlideGroupIndex + settings.value.groupsToScroll
    } else {
      return false
    }
  }

  slideGroupHandler(nextIndex)
}

const pause = (
  pauseType: null | PlayingType | keyof typeof PlayingType = null
) => {
  if (state.value.autoplayTimer) {
    clearInterval(state.value.autoplayTimer)
    state.value.autoplayTimer = null
  }
  const autoplaying = state.value.autoplaying
  if (pauseType === PlayingType.paused) {
    state.value.autoplaying = PlayingType.paused
  } else if (
    pauseType === PlayingType.focused &&
    (autoplaying === PlayingType.hovered || autoplaying === PlayingType.playing)
  ) {
    state.value.autoplaying = PlayingType.focused
  } else if (autoplaying === PlayingType.playing) {
    state.value.autoplaying = PlayingType.hovered
  } else if (autoplaying === null) {
    state.value.autoplaying = null
  }
}

const autoPlay = (playType: PlayingType | keyof typeof PlayingType) => {
  if (state.value.autoplayTimer) {
    clearInterval(state.value.autoplayTimer)
  }
  const autoplaying = state.value.autoplaying
  if (playType === PlayingType.update) {
    if (
      autoplaying === PlayingType.hovered ||
      autoplaying === PlayingType.focused ||
      autoplaying === PlayingType.paused
    ) {
      return
    }
  } else if (playType === PlayingType.leave) {
    if (
      autoplaying === PlayingType.paused ||
      autoplaying === PlayingType.focused
    ) {
      return
    }
  } else if (playType === PlayingType.blur) {
    if (
      autoplaying === PlayingType.paused ||
      autoplaying === PlayingType.hovered
    ) {
      return
    }
  }
  state.value.autoplayTimer = setInterval(
    play,
    settings.value.autoplaySpeed + 50
  )
  state.value.autoplaying = PlayingType.playing
}

const adaptHeight = () => {
  if (settings.value.adaptiveHeight && vSlickListRef.value) {
    const activeSlideGroups = vSlickListRef.value.querySelectorAll<HTMLElement>(
      '.v-slick-slide-group.active'
    )
    let maxHeight = 0
    activeSlideGroups.forEach((slideGroup) => {
      maxHeight = Math.max(maxHeight, slideGroup.offsetHeight)
    })
    vSlickListRef.value.style.height = maxHeight + 'px'
  }
}

const onTrackOver = () => {
  if (settings.value.autoplay) pause(PlayingType.hovered)
}

const onTrackLeave = () => {
  if (
    settings.value.autoplay &&
    state.value.autoplaying === PlayingType.hovered
  )
    autoPlay(PlayingType.leave)
}

const handleClickVSlickList = (e: Event) => {
  if (isVSlickListClickable === false) {
    e.stopPropagation()
    e.preventDefault()
  }
  isVSlickListClickable = true
}

const handleChildClickVSlickTrack = ({ index }: ChildClickPayload) => {
  if (!settings.value.focusOnSelect) return
  changeSlideGroup({
    message: 'children',
    index
  })
}

const handleKeyDownVSlickList = (e: KeyboardEvent) => {
  if (!settings.value.accessibility) return
  const navigation = getNavigationOnKeyType(
    e,
    settings.value.accessibility,
    settings.value.rtl
  )
  if (!navigation) return
  changeSlideGroup({ message: navigation as SlideNavigation })
}

const handleMouseDownOrTouchStartVSlickList = (e: SwipeEvent) => {
  if (!settings.value.touchMove) return
  const target = e.target as HTMLElement | null
  if (target?.classList.contains('no-swipe')) return
  swipeStart(e)
}

const handleMouseMoveOrTouchMoveVSlickList = (e: SwipeEvent) => {
  if (!state.value.dragging || !settings.value.touchMove) return
  const target = e.target as HTMLElement | null
  if (target?.classList.contains('no-swipe')) return
  swipeMove(e)
}

const handleMouseUpOrTouchEndVSlickList = (e: SwipeEvent) => {
  if (!settings.value.touchMove) return
  swipeEnd(e)
}

const handleMouseLeaveOrTouchCancelVSlickList = (e: SwipeEvent) => {
  if (!state.value.dragging || !settings.value.touchMove) return
  swipeEnd(e)
}

const handleMouseEnterOrOverVSlickTrack = () => {
  if (!settings.value.pauseOnHover) return
  onTrackOver()
}

const handleMouseLeaveVSlickTrack = () => {
  if (!settings.value.pauseOnHover) return
  onTrackLeave()
}

const handleOverDots = () => {
  if (settings.value.pauseOnDotsHover && settings.value.autoplay)
    pause(PlayingType.hovered)
}
const handleLeaveDots = () => {
  if (
    settings.value.pauseOnDotsHover &&
    settings.value.autoplay &&
    state.value.autoplaying === PlayingType.hovered
  )
    autoPlay(PlayingType.leave)
}

const handleClickDot = ({ index }: DotClickPayload) => {
  changeSlideGroup({
    message: 'dots',
    index
  })
}

const handleNextVSlickArrow = () => {
  changeSlideGroup({
    message: SlideNavigation.next
  })
}

const handlePrevVSlickArrow = () => {
  changeSlideGroup({
    message: SlideNavigation.previous
  })
}

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
  if (targetSlideGroupIndex === undefined || targetSlideGroupIndex === null)
    return
  slideGroupHandler(
    targetSlideGroupIndex,
    dontAnimate === true ? true : undefined
  )
}

const slideGroupHandler = async (index: number, dontAnimate = false) => {
  const { asNavFor, speed } = settings.value
  const currentSlideGroupIndex = state.value.currentSlideGroupIndex
  const states = getStatesOnSlide({
    index,
    ...settings.value,
    ...state.value,
    slideGroupCount: slideGroupCount.value,
    trackEl: vSlickTrackRef.value?.$el,
    useCSSTransitions: settings.value.useCSSTransitions && !dontAnimate
  } as OnSlideSpec)
  if (!states) return
  const { slidingState, afterSlidingState } = states
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
  await new Promise<void>((resolve) => {
    animationEndCallback = setTimeout(() => {
      const { animating, ...firstBatch } = afterSlidingState!
      if (
        settings.value.waitForAnimate ||
        state.value.currentSlideGroupIndex ===
          slidingState.currentSlideGroupIndex
      ) {
        Object.assign(state.value, firstBatch)
      }
      callbackTimers.push(
        setTimeout(() => {
          state.value.animating = animating || false
        })
      )
      emit('afterChange', slidingState.currentSlideGroupIndex)
      animationEndCallback = null
      resolve()
    }, speed)
  })
}

const updateState = (shouldSetTrackStyle?: boolean) => {
  const updatedState = getSliderState({
    ...settings.value,
    ...state.value,
    listEl: vSlickListRef.value,
    trackEl: vSlickTrackRef.value?.$el,
    slides: slides.value
  })
  const spec: TrackInfoSpec = {
    ...props,
    ...state,
    ...updatedState,
    trackEl: vSlickTrackRef.value?.$el,
    slideGroupCount: slideGroupCount.value
  }
  const targetLeft = getTrackLeft(spec as TrackInfoSpec)
  const trackStyle = getTrackCSS(spec as TrackInfoSpec, targetLeft)
  if (shouldSetTrackStyle || slideGroupCount.value !== spec.slideGroupCount) {
    updatedState.trackStyle = trackStyle
  }
  Object.assign(state.value, updatedState)
}

const resize = async (
  options: { shouldSetTrackStyle?: boolean; isWindowResize?: boolean } = {
    shouldSetTrackStyle: true
  }
) => {
  if (!vSlickTrackRef.value || !vSlickTrackRef.value.$el) {
    return
  }
  if (
    settings.value.widthDetection === WidthDetection.manual &&
    options.isWindowResize
  ) {
    await detectWidth()
  }
  updateState(
    options.shouldSetTrackStyle ||
      (settings.value.widthDetection === WidthDetection.manual &&
        options.isWindowResize)
  )
  if (props.autoplay) {
    autoPlay(PlayingType.update)
  } else {
    pause()
  }
}

const onResize = (options?: {
  shouldSetTrackStyle?: boolean
  isWindowResize?: boolean
}) => {
  debouncedResize?.cancel()
  debouncedResize = debounce(() => resize(options), DEBOUNCE_RESIZE_DURATION)
  debouncedResize()
}

const onResizeEventListener = () =>
  onResize({
    isWindowResize: true
  })

const onSlideGroupFocus = () => {
  if (settings.value.autoplay) pause(PlayingType.focused)
}
const onSlideGroupBlur = () => {
  if (
    settings.value.autoplay &&
    state.value.autoplaying === PlayingType.focused
  )
    autoPlay(PlayingType.blur)
}

const progressiveLazyLoad = () => {
  const slideGroupsToLoad = []
  const spec = { ...settings.value, ...state.value }
  const totalPostClones = getTotalPostClones({
    ...spec,
    slideGroupCount: slideGroupCount.value
  })
  const totalPreClones = getTotalPreClones({
    ...spec,
    slideGroupCount: slideGroupCount.value
  })
  for (
    let index = state.value.currentSlideGroupIndex;
    index < slideGroupCount.value + totalPostClones;
    index++
  ) {
    if (state.value.lazyLoadedList.indexOf(index) < 0) {
      slideGroupsToLoad.push(index)
      break
    }
  }
  for (
    let index = state.value.currentSlideGroupIndex - 1;
    index >= -totalPreClones;
    index--
  ) {
    if (state.value.lazyLoadedList.indexOf(index) < 0) {
      slideGroupsToLoad.push(index)
      break
    }
  }
  if (slideGroupsToLoad.length > 0) {
    state.value.lazyLoadedList =
      state.value.lazyLoadedList.concat(slideGroupsToLoad)
    emit('lazyLoad', slideGroupsToLoad)
  } else {
    if (lazyLoadTimer) {
      clearInterval(lazyLoadTimer)
      lazyLoadTimer = null
    }
  }
}

const checkImagesLoad = () => {
  const images = vSlickListRef.value?.querySelectorAll<HTMLImageElement>(
    '.v-slick-slide-group img'
  )
  const imagesCount = images?.length || 0
  let loadedCount = 0
  images?.forEach((image) => {
    const handler = () => {
      if (++loadedCount >= imagesCount) {
        onResize()
      }
    }
    if (!image.onclick) {
      image.onclick = () => {
        ;(image.closest('.v-slick-slide-group') as HTMLElement)?.focus()
      }
    } else {
      const prevClickHandler = image.onclick.bind(image)
      image.onclick = (e) => {
        prevClickHandler(e)
        ;(image.closest('.v-slick-slide-group') as HTMLElement)?.focus()
      }
    }
    if (!image.onload) {
      if (!settings.value.lazyLoad) return
      image.onload = () => {
        adaptHeight()
        callbackTimers.push(setTimeout(onResize, settings.value.speed))
      }
    } else {
      image.onload = handler
      image.onerror = () => {
        handler()
        emit('lazyLoadError')
      }
    }
  })
}

const detectWidth = async () => {
  state.value.detectingWidth = true
  return new Promise<void>((resolve) =>
    setTimeout(() => {
      Object.assign(vSlickCarouselStyle.value, {
        width: `${vSlickCarouselRef.value?.offsetWidth}px`
      })
      state.value.detectingWidth = false
      resolve()
    })
  )
}

const ssrInit = () => {
  const spec = {
    ...settings.value,
    ...state.value,
    slideGroupCount: slideGroupCount.value
  }
  const preClones = getTotalPreClones(spec)
  const postClones = getTotalPostClones(spec)
  if (settings.value.variableWidth) {
    let trackWidth = [],
      trackLeft = []
    const childrenWidths: number[] = []
    rawSlideGroups.value.forEach((slideGroup) => {
      let maxWidth = 0
      slideGroup.forEach((child) => {
        const { width } = child.props?.style || {}
        if (width) maxWidth = Math.max(maxWidth, width)
      })
      childrenWidths.push(maxWidth)
      trackWidth.push(maxWidth)
    })
    for (let i = 0; i < preClones; i++) {
      trackLeft.push(childrenWidths[childrenWidths.length - 1 - i])
      trackWidth.push(childrenWidths[childrenWidths.length - 1 - i])
    }
    for (let i = 0; i < postClones; i++) {
      trackWidth.push(childrenWidths[i])
    }
    for (let i = 0; i < state.value.currentSlideGroupIndex; i++) {
      trackLeft.push(childrenWidths[i])
    }
    trackWidth = trackWidth.filter((o) => o)
    trackLeft = trackLeft.filter((o) => o)
    const trackStyle = {
      width: `calc(${trackWidth.join(' + ')})`,
      left: `calc(${trackLeft.map((o) => `-${o}`).join(' + ')})`
    }
    if (settings.value.centerMode) {
      const currentWidth = childrenWidths[state.value.currentSlideGroupIndex]
      trackStyle.left = `calc(${trackLeft
        .map((o) => `-${o}`)
        .join(' + ')} + (100% - ${currentWidth}) / 2 )`
    }
    state.value.trackStyle = trackStyle
  } else {
    const _slideGroupCount = preClones + postClones + slideGroupCount.value
    const trackWidth = (100 / settings.value.groupsToShow) * _slideGroupCount
    const slideGroupWidth = 100 / _slideGroupCount
    let trackLeft =
      (-slideGroupWidth *
        (preClones + state.value.currentSlideGroupIndex) *
        trackWidth) /
      100
    if (settings.value.centerMode) {
      trackLeft += (100 - (slideGroupWidth * trackWidth) / 100) / 2
    }
    state.value.slideGroupWidth = slideGroupWidth + '%'
    state.value.trackStyle = {
      width: trackWidth + '%',
      left: trackLeft + '%'
    }
  }
}

const breakpoint = ref<number>()

const vSlickCarouselRef = ref<HTMLElement>()
const vSlickCarouselStyle = ref({})
const vSlickListRef = ref<HTMLElement>()
const vSlickTrackRef = ref<InstanceType<typeof VSlickTrack>>()

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

  if (settings.vertical && settings.rtl) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn(`vertical mode is enabled: rtl is disabled`)
    }
    settings.rtl = false
  }

  return settings
})

const canGoPrev = computed(() =>
  checkCanGoPrev({
    ...settings.value,
    ...state.value,
    slideGroupCount: slideGroupCount.value
  })
)

const canGoNext = computed(() =>
  checkCanGoNext({
    ...settings.value,
    ...state.value,
    slideGroupCount: slideGroupCount.value
  })
)

const pageCount = computed(() => {
  if (settings.value.infinite) {
    return Math.ceil(slideGroupCount.value / settings.value.groupsToScroll)
  }
  let pageCount =
    Math.ceil(
      (slideGroupCount.value - settings.value.groupsToShow) /
        settings.value.groupsToScroll
    ) + 1
  if (
    !settings.value.infinite &&
    settings.value.groupsToShow > 1 &&
    settings.value.centerMode
  ) {
    pageCount++
  }
  return pageCount < 0 ? 0 : pageCount
})

const slides = ref<VNode[]>(slots.default ? extractSlides(slots.default()) : [])

const state = ref({
  ...makeDefaultSliderState(),
  currentSlideGroupIndex: settings.value.initialGroupIndex
})

const currentSlideGroupIndex = computed(
  () => state.value.currentSlideGroupIndex
)

const currentGroupsToShow = computed(() => settings.value.groupsToShow)

const slideGroupCount = computed(() =>
  getSlideGroupCount(slides.value.length, settings.value.slidesPerGroup)
)

const rawSlideGroups = computed<VNode[][]>(() => {
  const slideGroups: VNode[][] = []
  const slidesPerGroup = settings.value.slidesPerGroup
  const slideGroupsCount = slideGroupCount.value
  for (let i = 0; i < slideGroupsCount; i++) {
    const startIndex = i * slidesPerGroup
    const endIndex = startIndex + slidesPerGroup
    slideGroups.push(slides.value.slice(startIndex, endIndex))
  }
  return slideGroups
})

watch(
  () => props,
  () => {
    clearBreakpoints()
    makeBreakpoints()
  },
  { deep: true }
)

watch(
  settings,
  (newSettings: Props, oldSettings: Props) => {
    let shouldSetTrackStyle = false
    for (const key of Object.keys(settings.value)) {
      if (!newSettings.hasOwnProperty(key)) {
        shouldSetTrackStyle = true
        break
      }
      if (
        typeof newSettings[key as keyof typeof newSettings] === 'object' ||
        typeof newSettings[key as keyof typeof newSettings] === 'function'
      ) {
        continue
      }
      if (
        newSettings[key as keyof typeof newSettings] !==
        oldSettings[key as keyof typeof newSettings]
      ) {
        shouldSetTrackStyle = true
        break
      }
    }
    updateState(shouldSetTrackStyle)
    if (state.value.currentSlideGroupIndex >= slideGroupCount.value) {
      changeSlideGroup({
        message: 'index',
        index: slideGroupCount.value - newSettings.groupsToShow
      })
    }
    if (newSettings.autoplay) {
      autoPlay(PlayingType.update)
    } else {
      pause(PlayingType.paused)
    }
  },
  {
    deep: true
  }
)

watch(
  () => slots.default?.() || [],
  (newSlots) => {
    slides.value = extractSlides(newSlots)
  }
)

watch(
  () => [
    state.value.listHeight,
    settings.value.centerMode,
    settings.value.centerPadding,
    settings.value.vertical
  ],
  ([listHeight, centerMode, centerPadding, vertical]) => {
    let verticalHeightStyle = {
      height: 'auto'
    }
    if (vertical) {
      verticalHeightStyle = {
        height: `${listHeight}px`
      }
    }

    let centerPaddingStyle
    if (!centerMode) {
      centerPaddingStyle = {
        padding: '0'
      }
    } else if (vertical) {
      centerPaddingStyle = {
        padding: centerPadding + ' 0px'
      }
    } else {
      centerPaddingStyle = {
        padding: '0px ' + centerPadding
      }
    }
    vSlickListStyle.value = {
      ...vSlickListStyle.value,
      ...filterUndefined(verticalHeightStyle),
      ...centerPaddingStyle
    }
  }
)

watch(
  () => [
    settings.value.infinite,
    state.value.currentSlideGroupIndex,
    settings.value.groupsToShow,
    slideGroupCount.value
  ],
  ([infinite, groupsIndex, groupToShow, slideGroupCount]) => {
    if (
      infinite ||
      (groupsIndex as number) <=
        (slideGroupCount as number) - (groupToShow as number) + 1
    )
      return
    slideGroupHandler(pageCount.value - 1)
  }
)

watch(
  () => state.value.dragging,
  (dragging) => {
    if (!vSlickListRef.value) return
    if (dragging) {
      vSlickListRef.value.onmousemove = handleMouseMoveOrTouchMoveVSlickList
      vSlickListRef.value.addEventListener(
        'touchmove',
        handleMouseMoveOrTouchMoveVSlickList,
        { passive: false }
      )
      vSlickListRef.value.onmouseup = handleMouseUpOrTouchEndVSlickList
      vSlickListRef.value.ontouchend = handleMouseUpOrTouchEndVSlickList
      vSlickListRef.value.onmouseleave = handleMouseLeaveOrTouchCancelVSlickList
      vSlickListRef.value.ontouchcancel =
        handleMouseLeaveOrTouchCancelVSlickList
    } else {
      vSlickListRef.value.onmousemove = null
      vSlickListRef.value.removeEventListener(
        'touchmove',
        handleMouseMoveOrTouchMoveVSlickList
      )
      vSlickListRef.value.onmouseup = null
      vSlickListRef.value.ontouchend = null
      vSlickListRef.value.onmouseleave = null
      vSlickListRef.value.ontouchcancel = null
    }
  }
)

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
  canGoNext,
  canGoPrev,
  play,
  pause,
  autoPlay,
  slideGroupCount,
  currentSlideGroupIndex,
  currentGroupsToShow,
  pageCount
})

onMounted(async () => {
  window.addEventListener('resize', onResizeEventListener)
  if (settings.value.widthDetection === WidthDetection.manual) {
    await detectWidth()
  }
  updateState(true)
  adaptHeight()
  if (settings.value.autoplay) {
    autoPlay(PlayingType.update)
  }
  if (settings.value.lazyLoad === LazyLoadType.progressive) {
    lazyLoadTimer = setInterval(progressiveLazyLoad, 1000)
  }
  ro = new ResizeObserver(() => {
    if (state.value.animating) {
      onResize({ shouldSetTrackStyle: false }) // do not set trackStyle so as to not break the animation
      callbackTimers.push(setTimeout(() => onResize(), settings.value.speed))
    } else {
      onResize()
    }
  })
  ro.observe(vSlickListRef.value as Element)
  vSlickListRef.value
    ?.querySelectorAll<HTMLElement>('.v-slick-slide-group')
    .forEach((slideGroup) => {
      slideGroup.onfocus = settings.value.pauseOnFocus
        ? onSlideGroupFocus
        : null
      slideGroup.onblur = settings.value.pauseOnFocus ? onSlideGroupBlur : null
    })
})

onUpdated(() => {
  checkImagesLoad()
  emit('reInit')
  if (settings.value.lazyLoad) {
    const slideGroupsToLoad = getOnDemandLazySlideGroups({
      ...settings.value,
      ...state.value
    })
    if (slideGroupsToLoad.length) {
      state.value.lazyLoadedList =
        state.value.lazyLoadedList.concat(slideGroupsToLoad)
      emit('lazyLoad', slideGroupsToLoad)
    }
  }
  adaptHeight()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResizeEventListener)
  ro?.unobserve(vSlickListRef.value as Element)
  if (animationEndCallback) {
    clearTimeout(animationEndCallback)
  }
  if (lazyLoadTimer) {
    clearInterval(lazyLoadTimer)
  }
  if (callbackTimers.length) {
    callbackTimers.forEach((timer) => clearTimeout(timer))
    callbackTimers = []
  }
  if (state.value.autoplayTimer) {
    clearInterval(state.value.autoplayTimer)
  }
})

makeBreakpoints()
ssrInit()
emit('init')
</script>

<style scoped lang="scss">
.v-slick-slider {
  position: relative;
  display: block;
  box-sizing: border-box;
}

.v-slick-list {
  position: relative;
  display: block;
  overflow: hidden;
  margin: 0;
  padding: 0;
  transform: translate3d(0, 0, 0);

  &:focus {
    outline: none;
  }

  &.dragging {
    cursor: pointer;
    cursor: hand;
  }
}
</style>
