import type { Settings } from 'v-slick-carousel'
import type { Example, ExampleSlide } from '../types'
import nationFlags from '../data/nation-flags'

export const id = 'as-nav-for'

const name = 'As Nav for'

const settings: Settings = {
  dots: false,
  infinite: true,
  groupsToShow: 1,
  groupsToScroll: 1,
  slidesPerGroup: 1,
  swipe: true,
  focusOnSelect: true,
  ignorePrefersReducedMotion: true
}

const slides: ExampleSlide[] = nationFlags.map((o) => ({
  img: o.img,
  text: o.nation
}))

export const codeC1 = String.raw`{
  "dots": false,
  "infinite": true,
  "groupsToShow": 1,
  "groupsToScroll": 1,
  "slidesPerGroup": 1,
  "swipe": true,
  "focusOnSelect": true,
  "asNavFor": c2
}
`

export const codeC2 = String.raw`{
  "dots": false,
  "infinite": true,
  "groupsToShow": 6,
  "groupsToScroll": 1,
  "slidesPerGroup": 1,
  "swipe": true,
  "focusOnSelect": true,
  "asNavFor": c1
}
`

const example: Example = {
  id,
  name,
  settings,
  slides
}

export default example
