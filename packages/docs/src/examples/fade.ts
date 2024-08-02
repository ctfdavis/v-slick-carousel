import type { Settings } from 'vue-3-slick-carousel'
import nationFlags from '../data/nation-flags'
import { Example, ExampleSlide } from '../types'

const id = 'fade'

const name = 'Fade'

const settings: Settings = {
  dots: false,
  infinite: true,
  groupsToShow: 1,
  groupsToScroll: 1,
  slidesPerGroup: 1,
  swipe: false,
  fade: true
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
