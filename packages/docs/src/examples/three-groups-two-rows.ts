import type { Settings } from 'v-slick-carousel'
import nationFlags from '../data/nation-flags'
import { Example, ExampleSlide } from '../types'

const id = 'three-groups-two-rows'

const name = 'Three Groups Two Rows'

const settings: Settings = {
  dots: true,
  infinite: false,
  groupsToShow: 3,
  groupsToScroll: 1,
  slidesPerGroup: 2,
  swipe: true,
  ignorePrefersReducedMotion: true
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
