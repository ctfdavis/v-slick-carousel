import type { Settings } from 'v-slick-carousel'
import type { Example, ExampleSlide } from '../types'
import items from '../data/items'

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

const slides: ExampleSlide[] = items.map((o) => ({
  img: o.img,
  text: o.name
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
