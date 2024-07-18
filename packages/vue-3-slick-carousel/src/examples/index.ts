import oneSlideFinite from './one-slide-finite'
import twoSlidesFinite from './two-slides-finite'
import oneSlideInfinite from './one-slide-infinite'
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
  [oneSlideFinite.id]: oneSlideFinite,
  [twoSlidesFinite.id]: twoSlidesFinite,
  [oneSlideInfinite.id]: oneSlideInfinite,
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
