import type { Settings } from '@lib/types'
import nationFlags from '../data/nation-flags'
import { Example, ExampleSlide } from '../types'

const id = 'one-slide-group-infinite'

const name = 'One Slide Group Infinite'

const settings: Settings = {
  dots: true,
  infinite: true,
  groupsToShow: 1,
  groupsToScroll: 1,
  slidesPerGroup: 1,
  swipe: true
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
  order: 3
}

export default example
