import type { Settings } from 'v-slick-carousel'
import items from '../data/items'
import { Example, ExampleSlide } from '../types'

const id = 'focus-on-select'

const name = 'Focus on Select'

const settings: Settings = {
  dots: false,
  infinite: true,
  groupsToShow: 4,
  groupsToScroll: 1,
  slidesPerGroup: 1,
  swipe: false,
  focusOnSelect: true,
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
