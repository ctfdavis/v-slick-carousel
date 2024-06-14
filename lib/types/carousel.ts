import { VNode } from 'vue'

import { LazyLoadType, PlayingType, SlideNavigation } from '.'
import { MarkRequiredWithPartialBase } from './helpers'

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
  initialGroup: number
  lazyLoad?: LazyLoadType | keyof typeof LazyLoadType
  pauseOnDotsHover: boolean
  pauseOnFocus: boolean
  pauseOnHover: boolean
  responsive: Responsive[]
  rows: number
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
  useCSS: boolean
  useTransform: boolean
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
  currentSlide: number
  direction: number
  dragging: boolean
  edgeDragged: boolean
  initialized: boolean
  lazyLoadedList: number[]
  listHeight?: number
  listWidth?: number
  scrolling: boolean
  slideHeight?: number | string
  slideWidth?: number | string
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
    slideIndex: number
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
  | 'rows'
  | 'groupsToScroll'
  | 'groupsToShow'
  | 'speed'
  | 'variableWidth'
  | 'vertical'
> &
  Pick<
    SliderState,
    | 'currentSlide'
    | 'lazyLoadedList'
    | 'listHeight'
    | 'trackStyle'
    | 'slideHeight'
    | 'slideWidth'
  > & {
    slideCount: number
    children: VNode[]
  }

export type ArrowProps = Pick<
  Props,
  'centerMode' | 'infinite' | 'groupsToShow'
> &
  Pick<SliderState, 'currentSlide'> & {
    slideCount: number
    type: 'next' | 'prev'
  }

export type DotsProps = Pick<
  Props,
  'dotsClass' | 'infinite' | 'groupsToScroll' | 'groupsToShow'
> &
  Pick<SliderState, 'currentSlide'> & {
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
  index: number
}

export type SwipeEvent = TouchEvent | MouseEvent

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
  | 'currentSlide'
  | 'lazyLoad'
  | 'infinite'
  | 'centerMode'
  | 'centerPadding'
>
