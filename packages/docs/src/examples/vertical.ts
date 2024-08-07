import type { Settings } from 'v-slick-carousel'
import items from '../data/items'
import { Example, ExampleSlide } from '../types'

const id = 'vertical'

const name = 'Vertical'

const settings: Settings = {
  infinite: false,
  groupsToShow: 2,
  groupsToScroll: 1,
  slidesPerGroup: 2,
  swipe: true,
  vertical: true,
  verticalSwiping: true
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
