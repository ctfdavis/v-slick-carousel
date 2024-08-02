import type { Settings } from 'vue-3-slick-carousel'
import nationFlags from '../data/nation-flags'
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
  swipeToSlide: true
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
