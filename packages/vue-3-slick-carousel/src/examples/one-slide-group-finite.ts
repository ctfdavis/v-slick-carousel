import type { Settings } from '@lib/types'
import nationFlags from '../data/nation-flags'
import { Example, ExampleSlide } from '../types'

const id = 'one-slide-group-finite'

const name = 'One Slide Group Finite'

const settings: Settings = {
  dots: true,
  infinite: false,
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
  order: 1
}

export default example
