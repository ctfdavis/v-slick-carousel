import { PropType, VNode } from 'vue'
import {
  ArrowProps,
  DotsProps,
  Props,
  Responsive,
  SlideNavigation,
  SliderState,
  TrackProps,
  WidthDetection
} from '../types'

type VuePropDef<T extends string> = Record<
  T,
  { type: PropType<unknown>; default: unknown }
>

const makeDefaultProps = (selectFields?: string[]) => {
  const defaultProps = {
    accessibility: { type: Boolean, default: true },
    adaptiveHeight: { type: Boolean, default: false },
    arrows: { type: Boolean, default: true },
    asNavFor: {
      type: Object,
      default: null
    },
    autoplay: { type: Boolean, default: false },
    autoplaySpeed: { type: Number, default: 3000 },
    centerMode: { type: Boolean, default: false },
    centerPadding: { type: String, default: '50px' },
    cssEase: { type: String, default: 'ease' },
    dots: { type: Boolean, default: false },
    draggable: { type: Boolean, default: true },
    edgeFriction: { type: Number, default: 0.35 },
    fade: { type: Boolean, default: false },
    focusOnSelect: { type: Boolean, default: false },
    ignorePrefersReducedMotion: { type: Boolean, default: false },
    infinite: { type: Boolean, default: true },
    infiniteLoopOnEdge: { type: Boolean, default: false },
    initialGroupIndex: { type: Number, default: 0 },
    lazyLoad: { type: String, default: null },
    nextArrowLabel: { type: String, default: 'Next' },
    pauseOnDotsHover: { type: Boolean, default: false },
    pauseOnFocus: { type: Boolean, default: false },
    pauseOnHover: { type: Boolean, default: true },
    prevArrowLabel: { type: String, default: 'Previous' },
    responsive: { type: Array as PropType<Responsive[]>, default: [] },
    rtl: { type: Boolean, default: false },
    slidesPerGroup: { type: Number, default: 1 },
    groupsToScroll: { type: Number, default: 1 },
    groupsToShow: { type: Number, default: 1 },
    speed: { type: Number, default: 500 },
    swipe: { type: Boolean, default: true },
    swipeToSlide: { type: Boolean, default: false },
    touchMove: { type: Boolean, default: true },
    touchThreshold: { type: Number, default: 5 },
    unslick: { type: Boolean, default: false },
    useCSSTransitions: { type: Boolean, default: true },
    useCSSTransform: { type: Boolean, default: true },
    variableWidth: { type: Boolean, default: false },
    vertical: { type: Boolean, default: false },
    verticalSwiping: { type: Boolean, default: false },
    waitForAnimate: { type: Boolean, default: true },
    widthDetection: { type: String, default: WidthDetection.auto }
  } satisfies VuePropDef<keyof Props>
  if (!selectFields) return defaultProps
  return Object.keys(defaultProps).reduce<{
    [key: string]: { type: PropType<unknown>; default: unknown }
  }>((acc, key) => {
    if (selectFields.includes(key)) {
      acc[key as keyof Props] = (defaultProps as any)[key]
    }
    return acc
  }, {}) as typeof defaultProps
}

export const defaultProps = makeDefaultProps() satisfies VuePropDef<keyof Props>

export const defaultPropValues = Object.keys(defaultProps).reduce<{
  [key: string]: unknown
}>((acc, key) => {
  acc[key] = (defaultProps as any)[key].default
  return acc
}, {}) as {
  [K in keyof Props]: unknown
} as Props

export const makeDefaultSliderState: () => SliderState = () => ({
  animating: false,
  autoplaying: null,
  autoplayTimer: null,
  currentDirection: 0,
  currentLeft: null,
  currentSlideGroupIndex: 0,
  detectingWidth: false,
  direction: 1,
  dragging: false,
  edgeDragged: false,
  initialized: false,
  lazyLoadedList: [],
  listHeight: undefined,
  listWidth: undefined,
  scrolling: false,
  slideGroupHeight: undefined,
  slideGroupWidth: undefined,
  swipeLeft: undefined,
  swiped: false,
  swiping: false,
  touchObject: { startX: 0, startY: 0, curX: 0, curY: 0, swipeLength: 0 },
  trackStyle: {},
  trackWidth: 0
})

export const defaultTrackProps = {
  ...makeDefaultProps([
    'centerMode',
    'centerPadding',
    'cssEase',
    'fade',
    'ignorePrefersReducedMotion',
    'infinite',
    'infiniteLoopOnEdge',
    'lazyLoad',
    'rtl',
    'groupsToScroll',
    'groupsToShow',
    'speed',
    'variableWidth',
    'vertical'
  ]),
  ...{
    currentSlideGroupIndex: { type: Number, default: 0 },
    detectingWidth: { type: Boolean, default: false },
    lazyLoadedList: {
      type: Array as PropType<number[]>,
      default: []
    },
    listHeight: { type: Number, default: undefined },
    trackStyle: { type: Object, default: {} },
    slideGroupCount: { type: Number, default: 0 },
    rawSlideGroups: { type: Array as PropType<VNode[][]>, default: [] },
    slideGroupHeight: { type: [String, Number], default: undefined },
    slideGroupWidth: { type: [String, Number], default: undefined }
  }
} satisfies VuePropDef<keyof TrackProps>

export const defaultArrowProps = {
  ...makeDefaultProps([
    'centerMode',
    'infinite',
    'groupsToShow',
    'prevArrowLabel',
    'nextArrowLabel'
  ]),
  ...{
    currentSlideGroupIndex: { type: Number, default: 0 },
    disabled: { type: Boolean, default: false },
    slideGroupCount: { type: Number, default: 0 },
    type: { type: String as PropType<SlideNavigation>, default: 'prev' }
  }
} satisfies VuePropDef<keyof ArrowProps>

export const defaultDotsProps = {
  ...makeDefaultProps(['infinite', 'groupsToScroll', 'groupsToShow']),
  ...{
    currentSlideGroupIndex: { type: Number, default: 0 },
    slideGroupCount: { type: Number, default: 0 },
    pageCount: { type: Number, default: 0 },
    currentPage: { type: Number, default: 0 }
  }
} satisfies VuePropDef<keyof DotsProps>
