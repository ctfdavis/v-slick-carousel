import { VSlickCarousel } from 'v-slick-carousel'
import 'v-slick-carousel/style.css'
import './style.scss'
import { defaultSlides, argInfo } from './common.ts'

export default {
  component: VSlickCarousel,
  title: 'VSlickCarousel',
  tags: ['autodocs'],
  ...argInfo
}

export const OneSlideFinite = {
  args: {
    default: defaultSlides()
  }
}

export const OneSlideInfinite = {
  args: {
    default: defaultSlides(),
    infinite: true
  }
}

export const TwoSlideGroupsFinite = {
  args: {
    default: defaultSlides(),
    groupsToShow: 2
  }
}

export const TwoSlidesPerGroupThreeGroupsFinite = {
  args: {
    default: defaultSlides(20),
    groupsToShow: 3,
    slidesPerGroup: 2
  }
}

export const Vertical = {
  args: {
    default: defaultSlides(),
    vertical: true,
    verticalSwiping: true
  }
}

export const LazyLoadOnDemand = {
  args: {
    default: defaultSlides(),
    lazyLoad: 'ondemand'
  }
}

export const Responsive = {
  args: {
    default: defaultSlides(),
    groupsToShow: 1,
    infinite: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          groupsToShow: 3
        }
      },
      {
        breakpoint: 600,
        settings: {
          groupsToShow: 2
        }
      }
    ]
  }
}

export const FocusOnSelect = {
  args: {
    default: defaultSlides(),
    groupsToShow: 3,
    infinite: true,
    focusOnSelect: true
  }
}

export const ResponsiveInfiniteFiniteEdgeCases = {
  args: {
    default: defaultSlides(20),
    groupsToShow: 2,
    infinite: false,
    responsive: [
      {
        breakpoint: 600,
        settings: {
          groupsToShow: 3,
          infinite: true
        }
      }
    ]
  }
}
