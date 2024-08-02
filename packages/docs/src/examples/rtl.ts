import type { Settings } from 'vue-3-slick-carousel'
import nationFlags from '../data/nation-flags'
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
  rtl: true
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
