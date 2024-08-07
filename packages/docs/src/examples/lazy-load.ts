import type { Settings } from 'v-slick-carousel'
import items from '../data/items'
import { Example, ExampleSlide } from '../types'

const id = 'lazy-load'

const name = 'Lazy Load'

const settings: Settings = {
  dots: true,
  infinite: true,
  groupsToShow: 1,
  groupsToScroll: 1,
  slidesPerGroup: 1,
  swipe: false,
  lazyLoad: 'ondemand',
  ignorePrefersReducedMotion: true
}

const slides: ExampleSlide[] = items.map((o) => ({
  img: o.img,
  text: o.name
}))

const example: Example = {
  id,
  name,
  settings,
  slides
}

export default example
