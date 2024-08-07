import type { Settings } from 'v-slick-carousel'
import items from '../data/items'
import { Example, ExampleSlide } from '../types'

const id = 'swipe-to-slide'

const name = 'Swipe to Slide'

const settings: Settings = {
  dots: true,
  infinite: false,
  groupsToShow: 3,
  groupsToScroll: 1,
  slidesPerGroup: 1,
  swipe: true,
  swipeToSlide: true,
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
