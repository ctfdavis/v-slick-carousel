import type { Settings } from '@lib/types'
import nationFlags from '../data/nation-flags'
import { ExampleSlide } from '../types'

const id = 'one-slide-finite'

const name = 'One Slide Finite'

const settings: Settings = {
  dots: true,
  infinite: false,
  groupsToShow: 1,
  groupsToScroll: 1,
  slidesPerGroup: 1,
  swipe: true,
  swipeToSlide: true
}

const slides: ExampleSlide[] = nationFlags.map((o) => ({
  img: o.img,
  text: o.nation
}))

export default {
  id,
  name,
  settings,
  slides
}
