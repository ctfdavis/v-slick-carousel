import { VNode } from 'vue'

import { LazyLoadType, PlayingType, SlideNavigation, SwipeDirection } from '.'
import {
  Combine,
  MarkRequiredAndPartialKeysWithPartialBase,
  MarkRequiredWithPartialBase
} from './helpers'
import VSlickCarousel from '@lib/components/VSlickCarousel.vue'

export type Props = {
  accessibility: boolean
  adaptiveHeight: boolean
  arrows: boolean
  asNavFor?: object
  autoplay: boolean
  autoplaySpeed: number
  centerMode: boolean
  centerPadding: string
  cssEase: string
  dots: boolean
  dotsClass: string
  draggable: boolean
  edgeFriction: number
  fade: boolean
  focusOnSelect: boolean
  infinite: boolean
  initialGroupIndex: number
  lazyLoad?: LazyLoadType | keyof typeof LazyLoadType
  pauseOnDotsHover: boolean
  pauseOnFocus: boolean
  pauseOnHover: boolean
  responsive: Responsive[]
  rtl: boolean
  slidesPerGroup: number
  groupsToScroll: number
  groupsToShow: number
  showDefaultArrows: boolean
  showDefaultDots: boolean
  speed: number
  swipe: boolean
  swipeToSlide: boolean
  touchMove: boolean
  touchThreshold: number
  useCSSTransitions: boolean
  useCSSTransform: boolean
  variableWidth: boolean
  vertical: boolean
  verticalSwiping: boolean
  waitForAnimate: boolean
  isSlidePredicate?: (vnode: VNode) => boolean
}

export type Responsive = {
  breakpoint: number
  settings: Partial<Omit<Props, 'responsive'>>
}

export type TouchObject = {
  startX: number
  startY: number
  curX: number
  curY: number
  swipeLength: number
}

export type SliderState = {
  animating: boolean
  autoplaying: null | PlayingType | keyof typeof PlayingType
  autoplayTimer: null | NodeJS.Timeout
  currentDirection: number
  currentLeft: null | number
  currentSlideGroupIndex: number
  direction: number
  dragging: boolean
  edgeDragged: boolean
  initialized: boolean
  lazyLoadedList: number[]
  listHeight?: number
  listWidth?: number
  scrolling: boolean
  slideGroupHeight?: number | string
  slideGroupWidth?: number | string
  swipeLeft?: number
  swiped: boolean
  swiping: boolean
  touchObject: TouchObject
  trackStyle: object
  trackWidth: number
}

export type SliderSpec = Props &
  SliderState & {
    slideGroupCount: number
    trackEl: HTMLElement
    listEl: HTMLElement
  }

export type TrackProps = Pick<
  Props,
  | 'centerMode'
  | 'centerPadding'
  | 'cssEase'
  | 'fade'
  | 'infinite'
  | 'lazyLoad'
  | 'rtl'
  | 'groupsToScroll'
  | 'groupsToShow'
  | 'speed'
  | 'variableWidth'
  | 'vertical'
> &
  Pick<
    SliderState,
    | 'currentSlideGroupIndex'
    | 'lazyLoadedList'
    | 'listHeight'
    | 'trackStyle'
    | 'slideGroupHeight'
    | 'slideGroupWidth'
  > & {
    slideGroupCount: number
    rawSlideGroups: VNode[][]
  }

export type ArrowProps = Pick<
  Props,
  'centerMode' | 'infinite' | 'groupsToShow'
> &
  Pick<SliderState, 'currentSlideGroupIndex'> & {
    slideCount: number
    type: 'next' | 'prev'
  }

export type DotsProps = Pick<
  Props,
  'dotsClass' | 'infinite' | 'groupsToScroll' | 'groupsToShow'
> &
  Pick<SliderState, 'currentSlideGroupIndex'> & {
    slideCount: number
  }

export type ArrowSlotProps = {
  currentSlide: number
  slideCount: number
  disabled: boolean
  onClick: () => void
}

export type DotClickPayload = {
  index: number
  groupsToScroll: number
}

export type ChildClickPayload = {
  index: number
}

export type IndexPayload = {
  index: number
}

export type CloneSlideOptions = {
  key: string
  class: string[]
  attrs: Record<string, string | number>
  style: Record<string, string | number>
  groupIndex: number
}

export type SwipeEvent = TouchEvent | MouseEvent

export type SwipeEndSpec = Combine<
  MarkRequiredWithPartialBase<
    SliderSpec,
    | 'currentSlideGroupIndex'
    | 'dragging'
    | 'swipe'
    | 'touchObject'
    | 'listEl'
    | 'listHeight'
    | 'listWidth'
    | 'rtl'
    | 'touchThreshold'
    | 'scrolling'
    | 'swipeLeft'
    | 'verticalSwiping'
  >,
  TrackInfoSpec
> & {
  swipeToSlide: boolean
  onSwipe?: (swipeDirection: string) => void
}

export type SwipeEndState = {
  dragging: boolean
  edgeDragged: boolean
  scrolling: boolean
  swiping: boolean
  swiped: boolean
  swipeLeft: number | null
  touchObject: TouchObject | object
  triggerSlideGroupHandler?: number
  currentDirection?: number
  trackStyle?: object
}

export type Settings = Partial<Props>

export type SlideGroupChangeOptions = {
  message: SlideNavigation | 'dots' | 'children' | 'index'
  index?: number
}

export type SlideGroupChangeSpec = MarkRequiredWithPartialBase<
  SliderSpec,
  | 'groupsToScroll'
  | 'groupsToShow'
  | 'slideGroupCount'
  | 'currentSlideGroupIndex'
  | 'lazyLoad'
  | 'infinite'
  | 'centerMode'
  | 'centerPadding'
>

export type TrackInfoSpec = MarkRequiredWithPartialBase<
  SliderSpec,
  | 'currentSlideGroupIndex'
  | 'centerPadding'
  | 'trackEl'
  | 'infinite'
  | 'centerMode'
  | 'slideGroupCount'
  | 'groupsToShow'
  | 'groupsToScroll'
  | 'slideGroupWidth'
  | 'listWidth'
  | 'variableWidth'
  | 'slideGroupHeight'
  | 'fade'
  | 'vertical'
>

export type OnSlideSpec = Combine<
  TrackInfoSpec,
  MarkRequiredWithPartialBase<
    SliderSpec,
    | 'waitForAnimate'
    | 'animating'
    | 'lazyLoadedList'
    | 'currentSlideGroupIndex'
    | 'useCSSTransitions'
  >
> & {
  index: number
}

export type VSlickCarouselInstance = InstanceType<typeof VSlickCarousel>

export type SlideCountSpec = MarkRequiredWithPartialBase<
  SliderSpec,
  | 'swipeToSlide'
  | 'listEl'
  | 'vertical'
  | 'rtl'
  | 'currentSlideGroupIndex'
  | 'slideGroupWidth'
  | 'groupsToShow'
  | 'swipeLeft'
  | 'slideGroupCount'
  | 'groupsToScroll'
>

export type NavigableSpec = MarkRequiredWithPartialBase<
  SliderSpec,
  'groupsToScroll' | 'groupsToShow' | 'slideGroupCount' | 'infinite'
>

export type SwipeMoveSpec = Combine<
  MarkRequiredWithPartialBase<
    SliderSpec,
    | 'scrolling'
    | 'animating'
    | 'vertical'
    | 'swipeToSlide'
    | 'verticalSwiping'
    | 'rtl'
    | 'currentSlideGroupIndex'
    | 'edgeFriction'
    | 'edgeDragged'
    | 'swiped'
    | 'swiping'
    | 'slideGroupCount'
    | 'groupsToScroll'
    | 'infinite'
    | 'touchObject'
    | 'listHeight'
    | 'listWidth'
  >,
  TrackInfoSpec
> & {
  swipeEvent?: (
    swipeDirection: SwipeDirection | keyof typeof SwipeDirection
  ) => void
  onEdge?: (
    swipeDirection: SwipeDirection | keyof typeof SwipeDirection
  ) => void
}

export type GoNextSpec = MarkRequiredWithPartialBase<
  SliderSpec,
  | 'infinite'
  | 'centerMode'
  | 'currentSlideGroupIndex'
  | 'slideGroupCount'
  | 'groupsToShow'
>

export type LazyInfoSpec = MarkRequiredWithPartialBase<
  SliderSpec,
  | 'currentSlideGroupIndex'
  | 'centerMode'
  | 'groupsToShow'
  | 'centerPadding'
  | 'lazyLoadedList'
>

export type CloneInfoSpec = MarkRequiredWithPartialBase<
  SliderSpec,
  | 'infinite'
  | 'variableWidth'
  | 'groupsToShow'
  | 'centerMode'
  | 'slideGroupCount'
>

export type SwipeMoveState = {
  scrolling?: boolean
  touchObject?: TouchObject
  swipeLeft?: number
  trackStyle?: object
  edgeDragged?: boolean
  swiped?: boolean
  swiping?: boolean
}

export type SliderStateInfoSpec = MarkRequiredAndPartialKeysWithPartialBase<
  SliderSpec,
  | 'vertical'
  | 'centerMode'
  | 'centerPadding'
  | 'initialGroupIndex'
  | 'currentSlideGroupIndex'
  | 'rtl'
  | 'autoplay'
  | 'autoplaying'
  | 'groupsToShow',
  'listEl' | 'trackEl'
> & {
  slides: VNode[]
}

export type SlideGroup = {
  slides: VNode[]
  key: string
  class?: string[]
  style?: Record<string, string | number>
  attrs?: Record<string, string | number>
  onClick?: () => void
}
