import type { Settings } from 'v-slick-carousel'
import items from '../data/items'
import { Example, ExampleSlide } from '../types'

export const id = 'flex-layout'

const name = 'Flex Layout'

const settings: Settings = {
  dots: false,
  infinite: false,
  groupsToShow: 1,
  groupsToScroll: 1,
  slidesPerGroup: 1,
  swipe: true,
  ignorePrefersReducedMotion: true,
  widthDetection: 'manual'
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
