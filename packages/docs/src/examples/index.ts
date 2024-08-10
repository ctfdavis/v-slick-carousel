import type { Example, OrderedExample } from '../types'
import oneSlideGroupFinite from './one-slide-group-finite'
import twoSlideGroupsFinite from './two-slide-groups-finite'
import oneSlideGroupInfinite from './one-slide-group-infinite'
import threeGroupsTwoRows from './three-groups-two-rows'
import swipeToSlide from './swipe-to-slide'
import responsive from './responsive'
import focusOnSelect from './focus-on-select'
import centerMode from './center-mode'
import fade from './fade'
import lazyLoad from './lazy-load'
import autoPlay from './auto-play'
import vertical from './vertical'
import rtl from './rtl'
import asNavFor from './as-nav-for'
import flexLayout from './flex-layout'

export default makeExamples([
  oneSlideGroupFinite,
  twoSlideGroupsFinite,
  oneSlideGroupInfinite,
  threeGroupsTwoRows,
  swipeToSlide,
  responsive,
  focusOnSelect,
  centerMode,
  fade,
  lazyLoad,
  autoPlay,
  vertical,
  rtl,
  asNavFor,
  flexLayout
])

function makeExamples(examples: Example[]): { [id: string]: OrderedExample } {
  return examples
    .map((o, i) => [o, i] as [Example, number])
    .reduce(
      (
        acc: { [id: string]: OrderedExample },
        [example, i]: [Example, number]
      ) => {
        acc[example.id] = {
          ...example,
          order: i
        }
        return acc
      },
      {}
    )
}
