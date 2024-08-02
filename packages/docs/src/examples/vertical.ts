import type { Settings } from 'vue-3-slick-carousel'
import nationFlags from '../data/nation-flags'
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
