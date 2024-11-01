import { VNode } from 'vue'
import {
  CloneInfoSpec,
  GoNextSpec,
  GoPrevSpec,
  LazyInfoSpec,
  NavigableSpec,
  OnSlideSpec,
  PlayingType,
  SlideGroupChangeOptions,
  SlideGroupChangeSpec,
  SlideGroupCountSpec,
  SlideNavigation,
  SliderState,
  SliderStateInfoSpec,
  SwipeDirection,
  SwipeEndSpec,
  SwipeEndState,
  SwipeEvent,
  SwipeMoveSpec,
  SwipeMoveState,
  TouchObject,
  TrackInfoSpec
} from '../types'
import { MarkRequiredWithPartialBase } from '@lib/types/helpers'

export const extractSlides = (vnodes: VNode[]): VNode[] => {
  return vnodes.flatMap((vnode) =>
    isSlide(vnode)
      ? [vnode]
      : Array.isArray(vnode.children) && vnode.children.length > 0
        ? extractSlides(vnode.children as VNode[])
        : []
  )
}

function isSlide(vnode: VNode): boolean {
  return !vnode.type.toString().startsWith('Symbol')
}

export const getNavigationOnKeyType = (
  e: KeyboardEvent,
  accessibility: boolean,
  rtl: boolean
) => {
  if (
    (e.target as HTMLElement)?.tagName.match('TEXTAREA|INPUT|SELECT') ||
    !accessibility
  )
    return ''
  if (e.key === 'ArrowLeft')
    return rtl ? SlideNavigation.next : SlideNavigation.previous
  if (e.key === 'ArrowRight')
    return rtl ? SlideNavigation.previous : SlideNavigation.next
  return ''
}

export const getChangedSlideGroupIndex = (
  spec: SlideGroupChangeSpec,
  options: SlideGroupChangeOptions
) => {
  let indexOffset,
    previousInt,
    slideGroupOffset,
    unevenOffset,
    targetSlideGroupIndex
  const {
    groupsToScroll,
    groupsToShow,
    slideGroupCount,
    currentSlideGroupIndex,
    lazyLoad,
    infinite
  } = spec
  unevenOffset = slideGroupCount % groupsToScroll !== 0
  indexOffset = unevenOffset
    ? 0
    : (slideGroupCount - currentSlideGroupIndex) % groupsToScroll

  if (options.message === SlideNavigation.previous) {
    slideGroupOffset =
      indexOffset === 0 ? groupsToScroll : groupsToShow - indexOffset
    targetSlideGroupIndex = currentSlideGroupIndex - slideGroupOffset
    if (lazyLoad && !infinite) {
      previousInt = currentSlideGroupIndex - slideGroupOffset
      targetSlideGroupIndex =
        previousInt === -1 ? slideGroupCount - 1 : previousInt
    }
  } else if (options.message === SlideNavigation.next) {
    slideGroupOffset = indexOffset === 0 ? groupsToScroll : indexOffset
    targetSlideGroupIndex = currentSlideGroupIndex + slideGroupOffset
    if (lazyLoad && !infinite) {
      targetSlideGroupIndex =
        ((currentSlideGroupIndex + groupsToScroll) % slideGroupCount) +
        indexOffset
    }
  } else if (options.message === 'dots') {
    // Click on dots
    targetSlideGroupIndex = (options.index || 0) * groupsToScroll
    if (targetSlideGroupIndex === currentSlideGroupIndex) {
      return null
    }
  } else if (options.message === 'children') {
    // Click on the slides
    targetSlideGroupIndex = options.index || 0
    if (targetSlideGroupIndex === currentSlideGroupIndex) {
      return null
    }
    if (infinite) {
      let direction = siblingDirection({ ...spec, targetSlideGroupIndex })
      if (
        targetSlideGroupIndex > currentSlideGroupIndex &&
        direction === 'left'
      ) {
        targetSlideGroupIndex = targetSlideGroupIndex - slideGroupCount
      } else if (
        targetSlideGroupIndex < currentSlideGroupIndex &&
        direction === 'right'
      ) {
        targetSlideGroupIndex = targetSlideGroupIndex + slideGroupCount
      }
    }
  } else if (options.message === 'index') {
    targetSlideGroupIndex = Number(options.index)
    if (targetSlideGroupIndex === currentSlideGroupIndex) {
      return null
    }
  }
  return targetSlideGroupIndex
}

export const siblingDirection = (
  spec: SlideGroupChangeSpec & { targetSlideGroupIndex: number }
) => {
  if (spec.targetSlideGroupIndex > spec.currentSlideGroupIndex) {
    if (
      spec.targetSlideGroupIndex >
      spec.currentSlideGroupIndex + totalVisibleGroupsOnRightOfCurrGroup(spec)
    ) {
      return 'left'
    }
    return 'right'
  } else {
    if (
      spec.targetSlideGroupIndex <
      spec.currentSlideGroupIndex - totalVisibleGroupsOnLeftOfCurrGroup(spec)
    ) {
      return 'right'
    }
    return 'left'
  }
}

const totalVisibleGroupsOnRightOfCurrGroup = ({
  groupsToShow,
  centerMode,
  rtl,
  centerPadding
}: SlideGroupChangeSpec) => {
  if (centerMode) {
    let right = (groupsToShow - 1) / 2 + 1
    if (parseInt(centerPadding) > 0) right += 1
    if (rtl && groupsToShow % 2 === 0) right += 1
    return right
  }
  if (rtl) {
    return 0
  }
  return groupsToShow - 1
}

const totalVisibleGroupsOnLeftOfCurrGroup = ({
  groupsToShow,
  centerMode,
  rtl,
  centerPadding
}: SlideGroupChangeSpec) => {
  if (centerMode) {
    let left = (groupsToShow - 1) / 2 + 1
    if (parseInt(centerPadding) > 0) left += 1
    if (!rtl && groupsToShow % 2 === 0) left += 1
    return left
  }
  if (rtl) {
    return groupsToShow - 1
  }
  return 0
}

export const getNavigableIndexes = (spec: NavigableSpec) => {
  let max = spec.infinite ? spec.slideGroupCount * 2 : spec.slideGroupCount
  let breakpoint = spec.infinite ? spec.groupsToShow * -1 : 0
  let counter = spec.infinite ? spec.groupsToShow * -1 : 0
  let indexes = []
  while (breakpoint < max) {
    indexes.push(breakpoint)
    breakpoint = counter + spec.groupsToScroll
    counter += Math.min(spec.groupsToScroll, spec.groupsToShow)
  }
  return indexes
}

export const checkNavigable = (spec: NavigableSpec, index: number) => {
  const navigables = getNavigableIndexes(spec)
  let prevNavigable = 0
  if (index > navigables[navigables.length - 1]) {
    index = navigables[navigables.length - 1]
  } else {
    for (let n in navigables) {
      if (index < navigables[n]) {
        index = prevNavigable
        break
      }
      prevNavigable = navigables[n]
    }
  }
  return index
}

export const getSwipeStartState = (
  e: SwipeEvent,
  swipe: boolean,
  draggable: boolean
) => {
  if (!swipe || (!draggable && e.type.indexOf('mouse') !== -1)) return
  return {
    dragging: true,
    touchObject: {
      startX:
        window.TouchEvent && e instanceof TouchEvent
          ? e.touches[0].pageX
          : (e as MouseEvent).clientX,
      startY:
        window.TouchEvent && e instanceof TouchEvent
          ? e.touches[0].pageY
          : (e as MouseEvent).clientY,
      curX:
        window.TouchEvent && e instanceof TouchEvent
          ? e.touches[0].pageX
          : (e as MouseEvent).clientX,
      curY:
        window.TouchEvent && e instanceof TouchEvent
          ? e.touches[0].pageY
          : (e as MouseEvent).clientY
    }
  }
}

export const getTraversedSlideGroupCount = (spec: SlideGroupCountSpec) => {
  const centerOffset = spec.centerMode
    ? +spec.slideGroupWidth * Math.floor(spec.groupsToShow / 2)
    : 0
  let swipedSlideGroup
  const slickList = spec.listEl
  const slideGroups = slickList.querySelectorAll<HTMLElement>(
    '.v-slick-slide-group'
  )
  Array.from(slideGroups).every((grp) => {
    if (!spec.vertical) {
      if (
        grp.offsetLeft - centerOffset + grp.offsetWidth / 2 >
        spec.swipeLeft * -1
      ) {
        swipedSlideGroup = grp
        return false
      }
    } else {
      if (grp.offsetTop + grp.offsetHeight / 2 > spec.swipeLeft * -1) {
        swipedSlideGroup = grp
        return false
      }
    }

    return true
  })

  if (!swipedSlideGroup) {
    return 0
  }
  const currentIndex =
    spec.rtl === true
      ? spec.slideGroupCount - spec.currentSlideGroupIndex
      : spec.currentSlideGroupIndex
  const swipedSlideGroupIndex = (swipedSlideGroup as HTMLElement)?.dataset
    ?.index
  const groupsTraversed = Math.abs(
    swipedSlideGroupIndex ? parseInt(swipedSlideGroupIndex) : 0 - currentIndex
  )
  return groupsTraversed
}

export const getSwipeDirection = (
  touchObject: TouchObject,
  verticalSwiping = false
): SwipeDirection => {
  let xDist, yDist, r, swipeAngle
  xDist = touchObject.startX - touchObject.curX
  yDist = touchObject.startY - touchObject.curY
  r = Math.atan2(yDist, xDist)
  swipeAngle = Math.round((r * 180) / Math.PI)
  if (swipeAngle < 0) {
    swipeAngle = 360 - Math.abs(swipeAngle)
  }
  if (
    (swipeAngle <= 45 && swipeAngle >= 0) ||
    (swipeAngle <= 360 && swipeAngle >= 315)
  ) {
    return SwipeDirection.left
  }
  if (swipeAngle >= 135 && swipeAngle <= 225) {
    return SwipeDirection.right
  }
  if (verticalSwiping === true) {
    if (swipeAngle >= 35 && swipeAngle <= 135) {
      return SwipeDirection.up
    } else {
      return SwipeDirection.down
    }
  }

  return SwipeDirection.vertical
}

export const getSwipeEndState = (
  e: SwipeEvent,
  spec: SwipeEndSpec
): SwipeEndState | undefined => {
  const {
    dragging,
    swipe,
    touchObject,
    listWidth,
    touchThreshold,
    verticalSwiping,
    listHeight,
    currentSlideGroupIndex,
    swipeToSlide,
    scrolling,
    onSwipe,
    rtl
  } = spec
  if (!dragging) {
    if (swipe) e.preventDefault()
    return
  }
  let minSwipe = verticalSwiping
    ? listHeight / touchThreshold
    : listWidth / touchThreshold
  let swipeDirection = getSwipeDirection(touchObject, verticalSwiping)
  if (rtl) {
    if (swipeDirection === SwipeDirection.left) {
      swipeDirection = SwipeDirection.right
    } else if (swipeDirection === SwipeDirection.right) {
      swipeDirection = SwipeDirection.left
    }
  }
  // reset the state of touch related state variables.
  let state: SwipeEndState = {
    dragging: false,
    edgeDragged: false,
    scrolling: false,
    swiping: false,
    swiped: false,
    swipeLeft: null,
    touchObject: {}
  }
  if (scrolling) {
    return state
  }
  if (!touchObject.swipeLength) {
    return state
  }
  if (touchObject.swipeLength > minSwipe) {
    e.preventDefault()
    if (onSwipe) {
      onSwipe(swipeDirection)
    }
    let slideGroupCount, newSlideGroupIndex
    switch (swipeDirection) {
      case 'left':
      case 'up':
        newSlideGroupIndex = spec.swipeToSlide
          ? getTraversedSlideGroupCount(spec)
          : currentSlideGroupIndex + spec.groupsToScroll
        slideGroupCount = swipeToSlide
          ? checkNavigable(spec, newSlideGroupIndex)
          : newSlideGroupIndex
        state.currentDirection = 0
        break
      case 'right':
      case 'down':
        newSlideGroupIndex = spec.swipeToSlide
          ? getTraversedSlideGroupCount(spec)
          : currentSlideGroupIndex - spec.groupsToScroll
        slideGroupCount = swipeToSlide
          ? checkNavigable(spec, newSlideGroupIndex)
          : newSlideGroupIndex
        state.currentDirection = 1
        break
      default:
        slideGroupCount = currentSlideGroupIndex
    }
    state.triggerSlideGroupHandler = slideGroupCount
  } else {
    // Adjust the track back to its original position.
    let currentLeft = getTrackLeft(spec)
    state.trackStyle = getTrackAnimateCSS(spec, currentLeft)
  }
  return state
}

export function getLazySlidesOnLeft(spec: LazyInfoSpec) {
  return spec.centerMode
    ? Math.floor(spec.groupsToShow / 2) +
        (parseInt(spec.centerPadding) > 0 ? 1 : 0)
    : 0
}

export function getLazySlidesOnRight(spec: LazyInfoSpec) {
  return spec.centerMode
    ? Math.floor((spec.groupsToShow - 1) / 2) +
        1 +
        (parseInt(spec.centerPadding) > 0 ? 1 : 0)
    : spec.groupsToShow
}

export function getLazyStartIndex(spec: LazyInfoSpec) {
  return spec.currentSlideGroupIndex - getLazySlidesOnLeft(spec)
}

export function getLazyEndIndex(spec: LazyInfoSpec) {
  return spec.currentSlideGroupIndex + getLazySlidesOnRight(spec)
}

export function getOnDemandLazySlideGroups(spec: LazyInfoSpec) {
  let onDemandSlideGroups = []
  const startIndex = getLazyStartIndex(spec)
  const endIndex = getLazyEndIndex(spec)
  for (
    let slideGroupIndex = startIndex;
    slideGroupIndex < endIndex;
    slideGroupIndex++
  ) {
    if (spec.lazyLoadedList?.indexOf(slideGroupIndex) < 0) {
      onDemandSlideGroups.push(slideGroupIndex)
    }
  }
  return onDemandSlideGroups
}

export function getTrackCSS(spec: TrackInfoSpec, left: number) {
  let trackWidth, trackHeight
  const trackChildren = spec.slideGroupCount + 2 * spec.groupsToShow
  if (!spec.vertical) {
    trackWidth =
      getTotalSlideGroups(spec) * parseInt(`${spec.slideGroupWidth || 0}`)
  } else {
    trackHeight = trackChildren * parseInt(`${spec.slideGroupHeight || 0}`)
  }
  let style: Record<string, string | number> = {
    opacity: 1,
    transition: ''
  }
  if (spec.useCSSTransform) {
    let transform = !spec.vertical
      ? 'translate3d(' + left + 'px, 0px, 0px)'
      : 'translate3d(0px, ' + left + 'px, 0px)'
    style = {
      ...style,
      transform
    }
  } else {
    if (spec.vertical) {
      style['top'] = left
    } else {
      style['left'] = left
    }
  }
  if (spec.fade) style = { opacity: 1 }
  if (trackWidth) style.width = trackWidth + 'px'
  if (trackHeight) style.height = trackHeight + 'px'

  return style
}

export function getTotalSlideGroups(spec: TrackInfoSpec) {
  return spec.slideGroupCount <= spec.groupsToShow
    ? spec.slideGroupCount
    : getTotalPreClones(spec) + spec.slideGroupCount + getTotalPostClones(spec)
}

export function getTrackAnimateCSS(spec: TrackInfoSpec, left: number) {
  let style = getTrackCSS(spec, left)
  // useCSS is true by default so it can be undefined
  if (spec.useCSSTransform) {
    style.transition = 'transform ' + spec.speed + 'ms ' + spec.cssEase
  } else {
    if (spec.vertical) {
      style.transition = 'top ' + spec.speed + 'ms ' + spec.cssEase
    } else {
      style.transition = 'left ' + spec.speed + 'ms ' + spec.cssEase
    }
  }
  if (spec.ignorePrefersReducedMotion) {
    style.transition += ' !important'
  }
  return style
}

export function getTrackLeft(spec: TrackInfoSpec) {
  let {
    centerPadding,
    currentSlideGroupIndex,
    trackEl,
    infinite,
    centerMode,
    slideGroupCount,
    groupsToShow,
    groupsToScroll,
    slideGroupWidth,
    listWidth,
    variableWidth,
    slideGroupHeight,
    fade,
    vertical,
    rtl
  } = spec
  listWidth = listWidth || 0
  slideGroupWidth = slideGroupWidth || 0
  slideGroupHeight = slideGroupHeight || 0

  let slideGroupOffset = 0
  let targetLeft
  let targetSlide: HTMLElement | undefined
  let verticalOffset = 0

  if (fade || slideGroupCount === 1) {
    return 0
  }

  let slidesToOffset = 0
  if (infinite) {
    slidesToOffset = -getTotalPreClones(spec) // bring active slide to the beginning of visible area
    // if next scroll doesn't have enough children, just reach till the end of original slides instead of shifting groupsToScroll children
    if (
      slideGroupCount % groupsToScroll !== 0 &&
      currentSlideGroupIndex + groupsToScroll > slideGroupCount
    ) {
      slidesToOffset = -(currentSlideGroupIndex > slideGroupCount
        ? groupsToShow - (currentSlideGroupIndex - slideGroupCount)
        : slideGroupCount % groupsToScroll)
    }
    // in center mode, shift current slide group to the center of the frame
    if (centerMode) {
      slidesToOffset += Math.floor(groupsToShow / 2)
    }
  } else {
    if (
      slideGroupCount % groupsToScroll !== 0 &&
      currentSlideGroupIndex + groupsToScroll > slideGroupCount
    ) {
      slidesToOffset = groupsToShow - (slideGroupCount % groupsToScroll)
    }
    if (centerMode) {
      slidesToOffset = Math.floor(groupsToShow / 2)
    }
  }
  slideGroupOffset = slidesToOffset * parseInt(`${slideGroupWidth}`)
  verticalOffset = slidesToOffset * parseInt(`${slideGroupHeight}`)

  if (!vertical) {
    targetLeft =
      currentSlideGroupIndex * parseInt(`${slideGroupWidth}`) * -1 +
      slideGroupOffset
  } else {
    targetLeft =
      currentSlideGroupIndex * parseInt(`${slideGroupHeight}`) * -1 +
      verticalOffset
  }

  if (variableWidth === true) {
    let targetSlideIndex
    targetSlideIndex = currentSlideGroupIndex + getTotalPreClones(spec)
    targetSlide =
      trackEl && (trackEl.childNodes[targetSlideIndex] as HTMLElement)
    targetLeft = targetSlide ? targetSlide.offsetLeft * -1 : 0
    if (centerMode === true) {
      targetSlideIndex = infinite
        ? currentSlideGroupIndex + getTotalPreClones(spec)
        : currentSlideGroupIndex
      targetLeft = 0
      if (trackEl) {
        targetSlide = trackEl.children[targetSlideIndex] as HTMLElement
        for (let slide = 0; slide < targetSlideIndex; slide++) {
          if (!trackEl.children[slide]) continue
          targetLeft -= (trackEl.children[slide] as HTMLElement).offsetWidth
        }
      }
      targetLeft -= parseInt(centerPadding)
      if (targetSlide) {
        targetLeft += listWidth - targetSlide.offsetWidth / 2
      }
    }
  }

  if (rtl) targetLeft = -targetLeft

  return targetLeft
}

export const canGoPrev = (spec: GoPrevSpec) => {
  return (
    spec.infinite ||
    (spec.currentSlideGroupIndex !== 0 &&
      spec.slideGroupCount > spec.groupsToShow)
  )
}

export const canGoNext = (spec: GoNextSpec) => {
  let canGo = true
  if (!spec.infinite) {
    if (spec.centerMode) {
      canGo = spec.currentSlideGroupIndex < spec.slideGroupCount - 1
    } else if (
      spec.slideGroupCount <= spec.groupsToShow ||
      spec.currentSlideGroupIndex >= spec.slideGroupCount - spec.groupsToShow
    ) {
      canGo = false
    }
  }
  return canGo
}

export const getStatesOnSlide = (spec: OnSlideSpec) => {
  let {
    waitForAnimate,
    animating,
    fade,
    infinite,
    index,
    slideGroupCount,
    lazyLoadedList,
    lazyLoad,
    currentSlideGroupIndex,
    centerMode,
    groupsToScroll,
    groupsToShow,
    useCSSTransitions
  } = spec
  if (
    (waitForAnimate && animating) ||
    (fade && !infinite && (index < 0 || index >= slideGroupCount))
  )
    return
  let animationSlideGroupIndex = index,
    finalSlideGroupIndex
  let slidingState: Partial<SliderState> = {},
    afterSlidingState: Partial<SliderState> = {}
  if (fade) {
    if (index < 0) {
      animationSlideGroupIndex += slideGroupCount
    } else if (index >= slideGroupCount) {
      animationSlideGroupIndex -= slideGroupCount
    }
    if (lazyLoad && lazyLoadedList.indexOf(animationSlideGroupIndex) < 0) {
      lazyLoadedList.push(animationSlideGroupIndex)
    }
    slidingState = {
      animating: true,
      currentSlideGroupIndex: animationSlideGroupIndex,
      lazyLoadedList
    }
    afterSlidingState = { animating: false }
    return {
      slidingState,
      afterSlidingState
    }
  }
  finalSlideGroupIndex = animationSlideGroupIndex
  if (animationSlideGroupIndex < 0) {
    finalSlideGroupIndex = animationSlideGroupIndex + slideGroupCount
    if (!infinite) finalSlideGroupIndex = 0
    else if (slideGroupCount % groupsToScroll !== 0)
      finalSlideGroupIndex =
        slideGroupCount - (slideGroupCount % groupsToScroll)
  } else if (
    !canGoNext(spec) &&
    animationSlideGroupIndex > currentSlideGroupIndex
  ) {
    animationSlideGroupIndex = finalSlideGroupIndex = currentSlideGroupIndex
  } else if (centerMode && animationSlideGroupIndex >= slideGroupCount) {
    animationSlideGroupIndex = infinite ? slideGroupCount : slideGroupCount - 1
    finalSlideGroupIndex = infinite ? 0 : slideGroupCount - 1
  } else if (animationSlideGroupIndex >= slideGroupCount) {
    finalSlideGroupIndex = animationSlideGroupIndex - slideGroupCount
    if (!infinite) finalSlideGroupIndex = slideGroupCount - groupsToShow
    else if (slideGroupCount % groupsToScroll !== 0) finalSlideGroupIndex = 0
  }
  let finalLeft = getTrackLeft({
    ...spec,
    currentSlideGroupIndex: finalSlideGroupIndex
  })
  let animationLeft = getTrackLeft({
    ...spec,
    currentSlideGroupIndex: animationSlideGroupIndex
  })
  if (!infinite) {
    if (animationLeft === finalLeft)
      animationSlideGroupIndex = finalSlideGroupIndex
    animationLeft = finalLeft
  }
  if (lazyLoad)
    lazyLoadedList = lazyLoadedList.concat(
      getOnDemandLazySlideGroups({
        ...spec,
        currentSlideGroupIndex: animationSlideGroupIndex
      })
    )
  if (!useCSSTransitions) {
    slidingState = {
      currentSlideGroupIndex: finalSlideGroupIndex,
      trackStyle: getTrackCSS(spec, finalLeft),
      lazyLoadedList
    }
    return {
      slidingState,
      afterSlidingState
    }
  }
  slidingState = {
    animating: true,
    currentSlideGroupIndex: finalSlideGroupIndex,
    trackStyle: getTrackAnimateCSS(spec, animationLeft),
    lazyLoadedList
  }
  afterSlidingState = {
    animating: false,
    currentSlideGroupIndex: finalSlideGroupIndex,
    trackStyle: getTrackCSS(spec, finalLeft),
    swipeLeft: undefined
  }
  return { slidingState, afterSlidingState }
}

export function getTotalPreClones(spec: CloneInfoSpec) {
  if (!spec.infinite) {
    return 0
  }
  if (spec.variableWidth) {
    return spec.slideGroupCount
  }
  return spec.groupsToShow + (spec.centerMode ? 1 : 0)
}

export function getTotalPostClones(spec: CloneInfoSpec) {
  if (!spec.infinite) {
    return 0
  }
  return spec.slideGroupCount
}

export const getSwipeMoveState = (
  e: SwipeEvent,
  spec: SwipeMoveSpec
): SwipeMoveState | undefined => {
  const {
    scrolling,
    animating,
    vertical,
    swipeToSlide,
    verticalSwiping,
    rtl,
    currentSlideGroupIndex,
    edgeFriction,
    edgeDragged,
    onEdge,
    swiped,
    swiping,
    slideGroupCount,
    groupsToScroll,
    infinite,
    touchObject,
    swipeEvent,
    listHeight,
    listWidth
  } = spec
  if (scrolling) return
  if (animating) {
    e.preventDefault()
    return
  }
  if (vertical && swipeToSlide && verticalSwiping) e.preventDefault()
  let swipeLeft,
    state: SwipeMoveState = {}
  let curLeft = getTrackLeft(spec)
  touchObject.curX =
    window.TouchEvent && e instanceof TouchEvent
      ? e.touches[0].pageX
      : (e as MouseEvent).clientX
  touchObject.curY =
    window.TouchEvent && e instanceof TouchEvent
      ? e.touches[0].pageY
      : (e as MouseEvent).clientY
  touchObject.swipeLength = Math.round(
    Math.sqrt(Math.pow(touchObject.curX - touchObject.startX, 2))
  )
  let verticalSwipeLength = Math.round(
    Math.sqrt(Math.pow(touchObject.curY - touchObject.startY, 2))
  )
  if (!verticalSwiping && !swiping && verticalSwipeLength > 10) {
    return { scrolling: true }
  }
  if (verticalSwiping) touchObject.swipeLength = verticalSwipeLength
  let positionOffset =
    (!rtl ? 1 : -1) * (touchObject.curX > touchObject.startX ? 1 : -1)
  if (verticalSwiping)
    positionOffset = touchObject.curY > touchObject.startY ? 1 : -1

  let dotCount = Math.ceil(slideGroupCount / groupsToScroll)
  let swipeDirection = getSwipeDirection(spec.touchObject, verticalSwiping)
  let touchSwipeLength = touchObject.swipeLength
  if (!infinite) {
    if (
      (currentSlideGroupIndex === 0 && swipeDirection === 'right') ||
      (currentSlideGroupIndex + 1 >= dotCount && swipeDirection === 'left') ||
      (!canGoNext(spec) && swipeDirection === 'left')
    ) {
      touchSwipeLength = Math.round(touchObject.swipeLength * edgeFriction)
      if (edgeDragged === false && onEdge) {
        onEdge(swipeDirection)
        state.edgeDragged = true
      }
    }
  }
  if (!swiped && swipeEvent) {
    swipeEvent(swipeDirection)
    state.swiped = true
  }
  if (!vertical) {
    if (!rtl) {
      swipeLeft = curLeft + touchSwipeLength * positionOffset
    } else {
      swipeLeft = curLeft - touchSwipeLength * positionOffset
    }
  } else {
    swipeLeft =
      curLeft + touchSwipeLength * (listHeight / listWidth) * positionOffset
  }
  if (verticalSwiping) {
    swipeLeft = curLeft + touchSwipeLength * positionOffset
  }
  state = {
    ...state,
    touchObject,
    swipeLeft,
    trackStyle: getTrackCSS(spec, swipeLeft),
    swipeDirection
  }
  if (
    Math.abs(touchObject.curX - touchObject.startX) <
    Math.abs(touchObject.curY - touchObject.startY) * 0.8
  ) {
    return state
  }
  if (touchObject.swipeLength > 10) {
    state.swiping = true
    e.preventDefault()
  }
  return state
}

export function getSlideGroupCount(slideCount: number, groupsToShow: number) {
  return Math.ceil(slideCount / groupsToShow)
}

export function getSliderState(spec: SliderStateInfoSpec) {
  let slideGroupCount = getSlideGroupCount(
    spec.slides.length,
    spec.groupsToShow
  )
  let listWidth = Math.ceil(spec.listEl?.offsetWidth || 0)
  let trackWidth = Math.ceil(spec.trackEl?.offsetWidth || 0)
  let slideGroupWidth
  if (!spec.vertical) {
    let centerPaddingAdj = spec.centerMode
      ? parseInt(spec.centerPadding) * 2
      : 0
    if (
      typeof spec.centerPadding === 'string' &&
      spec.centerPadding.slice(-1) === '%'
    ) {
      centerPaddingAdj *= listWidth / 100
    }
    slideGroupWidth = Math.ceil(
      (listWidth - centerPaddingAdj) / spec.groupsToShow
    )
  } else {
    slideGroupWidth = listWidth
  }
  let slideGroupHeight =
    spec.listEl && spec.listEl.querySelector('[data-index="0"]')
      ? spec.listEl.querySelector<HTMLElement>('[data-index="0"]')
          ?.offsetHeight || 0
      : 0
  let listHeight = slideGroupHeight * spec.groupsToShow
  let currentSlideGroupIndex =
    spec.currentSlideGroupIndex === undefined
      ? spec.initialGroupIndex
      : spec.currentSlideGroupIndex
  if (spec.rtl && spec.currentSlideGroupIndex === undefined) {
    currentSlideGroupIndex = slideGroupCount - 1 - spec.initialGroupIndex
  }
  let lazyLoadedList = spec.lazyLoadedList || []
  let slideGroupsToLoad = getOnDemandLazySlideGroups(spec as LazyInfoSpec)
  lazyLoadedList.concat(slideGroupsToLoad)

  let sliderState: MarkRequiredWithPartialBase<
    SliderState,
    | 'currentSlideGroupIndex'
    | 'listWidth'
    | 'slideGroupHeight'
    | 'slideGroupWidth'
  > & { slideGroupCount: number } = {
    slideGroupCount,
    slideGroupWidth,
    listWidth,
    trackWidth,
    currentSlideGroupIndex,
    slideGroupHeight,
    listHeight,
    lazyLoadedList
  }

  if (spec.autoplaying === null && spec.autoplay) {
    sliderState.autoplaying = PlayingType.playing
  }

  return sliderState
}
