import type { Settings } from '@lib/types'
import nationFlags from '../data/nation-flags'
import { Example, ExampleSlide } from '../types'

const id = 'center-mode'

const name = 'Center Mode'

const settings: Settings = {
  dots: true,
  infinite: true,
  groupsToShow: 3,
  groupsToScroll: 1,
  slidesPerGroup: 1,
  swipe: true,
  centerMode: true,
  centerPadding: '100px'
}

const slides: ExampleSlide[] = nationFlags.map((o) => ({
  img: o.img,
  text: o.nation
}))

const example: Example = {
  id,
  name,
  settings,
  slides,
  order: 7
}

export default example
