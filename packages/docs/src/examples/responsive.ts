import type { Settings } from 'v-slick-carousel'
import items from '../data/items'
import { Example, ExampleSlide } from '../types'

const id = 'responsive'

const name = 'Responsive'

const settings: Settings = {
  dots: true,
  infinite: false,
  groupsToScroll: 1,
  groupsToShow: 5,
  slidesPerGroup: 1,
  swipe: true,
  ignorePrefersReducedMotion: true,
  responsive: [
    {
      breakpoint: 480,
      settings: {
        groupsToShow: 1
      }
    },
    {
      breakpoint: 680,
      settings: {
        groupsToShow: 2
      }
    },
    {
      breakpoint: 1080,
      settings: {
        groupsToShow: 3
      }
    },
    {
      breakpoint: 1400,
      settings: {
        groupsToShow: 4
      }
    }
  ]
}

const slides: ExampleSlide[] = items.map((o) => ({
  img: o.img,
  text: o.name
}))

const example: Example = {
  id,
  name,
  settings,
  slides
}

export default example
