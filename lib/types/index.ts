import { VNode } from 'vue'

export type MarkRequired<T, K extends keyof T> = T & Pick<Required<T>, K>

export type MarkRequiredWithPartialBase<T, K extends keyof T> = MarkRequired<
  Partial<T>,
  K
>

export type MarkRequiredAndPartial<
  T,
  K extends keyof T,
  P extends keyof T
> = T & Pick<Required<T>, K> & Pick<Partial<T>, P>

export type MarkRequiredAndPartialKeysWithPartialBase<
  T,
  K extends keyof T,
  P extends keyof T
> = MarkRequiredAndPartial<Partial<T>, K, P>

// Caution: Does not work with indexable types
type RequiredKeys<T> = {
  [K in keyof T]-?: object extends Pick<T, K> ? never : K
}[keyof T]
type OptionalKeys<T> = {
  [K in keyof T]-?: object extends Pick<T, K> ? K : never
}[keyof T]
export type Combine<T1, T2> = Required<
  Pick<T1, RequiredKeys<T1>> & Pick<T2, RequiredKeys<T2>>
> &
  Partial<Pick<T1, OptionalKeys<T1>> & Pick<T2, OptionalKeys<T2>>>

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
    slideCount: number
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

export enum PlayingType {
  play = 'play',
  playing = 'playing',
  paused = 'paused',
  hovered = 'hovered',
  focused = 'focused',
  update = 'update',
  leave = 'leave',
  blur = 'blur'
}

export enum LazyLoadType {
  ondemand = 'ondemand',
  progressive = 'progressive'
}

export type SwipeEvent = TouchEvent | MouseEvent

export enum SwipeDirection {
  left = 'left',
  right = 'right',
  up = 'up',
  down = 'down',
  vertical = 'vertical'
}

export type Settings = Partial<Props>
