import oneSlideGroupFinite from './one-slide-group-finite'
import twoSlideGroupsFinite from './two-slide-groups-finite'
import oneSlideGroupInfinite from './one-slide-group-infinite'
import threeGroupsTwoRows from './three-groups-two-rows'
import responsive from './responsive'
import focusOnSelect from './focus-on-select'
import centerMode from './center-mode'
import fade from './fade'
import lazyLoad from './lazy-load'
import autoPlay from './auto-play'
import vertical from './vertical'
import rtl from './rtl'
import asNavFor from './as-nav-for'

export default {
  [oneSlideGroupFinite.id]: oneSlideGroupFinite,
  [twoSlideGroupsFinite.id]: twoSlideGroupsFinite,
  [oneSlideGroupInfinite.id]: oneSlideGroupInfinite,
  [threeGroupsTwoRows.id]: threeGroupsTwoRows,
  [responsive.id]: responsive,
  [focusOnSelect.id]: focusOnSelect,
  [centerMode.id]: centerMode,
  [fade.id]: fade,
  [lazyLoad.id]: lazyLoad,
  [autoPlay.id]: autoPlay,
  [vertical.id]: vertical,
  [rtl.id]: rtl,
  [asNavFor.id]: asNavFor
}
