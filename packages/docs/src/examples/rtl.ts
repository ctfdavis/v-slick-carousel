import type { Settings } from 'v-slick-carousel'
import items from '../data/items'
import { Example, ExampleSlide } from '../types'

const id = 'rtl'

const name = 'rtl (Right to Left)'

const settings: Settings = {
  dots: false,
  infinite: false,
  groupsToShow: 3,
  groupsToScroll: 3,
  slidesPerGroup: 1,
  swipe: true,
  rtl: true,
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
