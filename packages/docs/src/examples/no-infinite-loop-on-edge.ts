import type { Settings } from 'v-slick-carousel'
import items from '../data/items'
import { Example, ExampleSlide } from '../types'

const id = 'no-infinite-loop-on-edge'

const name = 'No Infinite Loop on Edge'

const settings: Settings = {
  dots: true,
  infinite: true,
  infiniteLoopOnEdge: false,
  groupsToShow: 3,
  groupsToScroll: 1,
  slidesPerGroup: 1,
  swipe: true,
  ignorePrefersReducedMotion: true
}

const slides: ExampleSlide[] = items.slice(0, 5).map((o) => ({
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
