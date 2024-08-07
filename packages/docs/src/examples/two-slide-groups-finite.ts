import type { Settings } from 'v-slick-carousel'
import items from '../data/items'
import { Example, ExampleSlide } from '../types'

const id = 'two-slide-groups-finite'

const name = 'Two Slide Groups Finite'

const settings: Settings = {
  dots: true,
  infinite: false,
  groupsToShow: 2,
  groupsToScroll: 2,
  slidesPerGroup: 1,
  swipe: true,
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
