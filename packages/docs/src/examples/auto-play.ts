import type { Settings } from 'v-slick-carousel'
import nationFlags from '../data/nation-flags'
import { Example, ExampleSlide } from '../types'

const id = 'auto-play'

const name = 'Auto Play'

const settings: Settings = {
  dots: true,
  infinite: true,
  groupsToShow: 3,
  groupsToScroll: 1,
  slidesPerGroup: 1,
  swipe: false,
  autoplay: true,
  autoplaySpeed: 1000,
  pauseOnHover: true
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
