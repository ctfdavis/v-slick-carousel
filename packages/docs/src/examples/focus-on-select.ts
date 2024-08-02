import type { Settings } from 'v-slick-carousel'
import nationFlags from '../data/nation-flags'
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
  focusOnSelect: true
}

const slides: ExampleSlide[] = nationFlags.map((o) => ({
  img: o.img,
  text: o.nation
}))

const example: Example = {
  id,
  name,
  settings,
  slides
}

export default example
