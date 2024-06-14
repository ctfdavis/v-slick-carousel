import { VNode } from 'vue'
import {
  OnSlideSpec,
  SlideGroupChangeOptions,
  SlideGroupChangeSpec,
  SlideNavigation,
  SliderState,
  SwipeEvent
} from '../types'

export const extractSlides = (
  vnodes: VNode[],
  isSlide = isSlidePredicate
): VNode[] => {
  return vnodes.flatMap((vnode) =>
    isSlide(vnode)
      ? [vnode]
      : Array.isArray(vnode.children) && vnode.children.length > 0
        ? extractSlides(vnode.children as VNode[])
        : []
  )
}

function isSlidePredicate(vnode: VNode): boolean {
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
  if (e.key === 'Left')
    return rtl ? SlideNavigation.next : SlideNavigation.previous
  if (e.key === 'Right')
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

export const getSwipeStartState = (
  e: SwipeEvent,
  swipe: boolean,
  draggable: boolean
) => {
  if (!swipe || (!draggable && e.type.indexOf('mouse') !== -1)) return ''
  return {
    dragging: true,
    touchObject: {
      startX: e instanceof TouchEvent ? e.touches[0].pageX : e.clientX,
      startY: e instanceof TouchEvent ? e.touches[0].pageY : e.clientY,
      curX: e instanceof TouchEvent ? e.touches[0].pageX : e.clientX,
      curY: e instanceof TouchEvent ? e.touches[0].pageY : e.clientY
    }
  }
}

export const getStatesOnSlideGroup = (spec: OnSlideSpec) => {
  const {
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
    useCSS
  } = spec
  if (waitForAnimate && animating) return {}
  let animationSlideGroupIndex = index,
    finalSlideGroupIndex,
    animationLeft,
    finalLeft
  let slidingState: Partial<SliderState> = {},
    afterSlidingState: Partial<SliderState> = {}
  if (fade) {
    if (!infinite && (index < 0 || index >= slideGroupCount)) return {}
    if (index < 0) {
      animationSlideGroupIndex = index + slideGroupCount
    } else if (index >= slideGroupCount) {
      animationSlideGroupIndex = index - slideGroupCount
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
  } else {
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
      animationSlideGroupIndex = infinite
        ? slideGroupCount
        : slideGroupCount - 1
      finalSlideGroupIndex = infinite ? 0 : slideGroupCount - 1
    } else if (animationSlideGroupIndex >= slideGroupCount) {
      finalSlideGroupIndex = animationSlideGroupIndex - slideGroupCount
      if (!infinite) finalSlideGroupIndex = slideGroupCount - groupsToShow
      else if (slideGroupCount % groupsToScroll !== 0) finalSlideGroupIndex = 0
    }
    animationLeft = getTrackLeft({
      ...spec,
      slideIndex: animationSlideGroupIndex
    })
    finalLeft = getTrackLeft({ ...spec, slideIndex: finalSlideGroupIndex })
    if (!infinite) {
      if (animationLeft === finalLeft)
        animationSlideGroupIndex = finalSlideGroupIndex
      animationLeft = finalLeft
    }
    lazyLoad &&
      lazyLoadedList.concat(
        getOnDemandLazySlides({
          ...spec,
          currentSlide: animationSlideGroupIndex
        })
      )
    if (!useCSS) {
      slidingState = {
        currentSlideGroupIndex: finalSlideGroupIndex,
        trackStyle: getTrackCSS(spec, finalLeft),
        lazyLoadedList
      }
    } else {
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
    }
  }
  return { slidingState, afterSlidingState }
}
