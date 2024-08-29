import { VSlickCarousel } from 'v-slick-carousel'
import 'v-slick-carousel/style.css'
import './style.css'
import { h } from 'vue'

export default {
  component: VSlickCarousel,
  title: 'VSlickCarousel',
  tags: ['autodocs'],
  args: {
    default: defaultSlides,
    dots: true,
    infinite: false,
    groupsToShow: 1,
  },
  argTypes: {
    default: {
      description: 'Slot for slides.',
      table: {
        category: 'slots',
        type: {
          summary: 'any'
        }
      }
    },
    dots: {
      description: 'Show the dots navigation',
    },
    infinite: {
      description: 'Infinite loop sliding',
    },
    groupsToShow: {
      description: 'Number of slide groups to show',
    }
  }
}

export const OneSlideFinite = {
  args: {
    default: defaultSlides
  }
}

export const OneSlideInfinite = {
    args: {
        default: defaultSlides,
        infinite: true
    }
}

export const TwoSlideGroupsFinite = {
    args: {
        default: defaultSlides(),
        groupsToShow: 2
    }
}

function defaultSlides(num = 10) {
  return Array.from({ length: num }, (_, i) => {
    return h(
      'div',
      {
        key: i,
        class: 'slide'
      },
      [
        h('h1', { class: 'no-swipe' }, `Slide ${i + 1}`),
        h('img', { src: `https://picsum.photos/800/400?random=${i}`, class: 'no-swipe' }),
        h('p', { class: 'no-swipe' }, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
      ]
    )
  })
}
