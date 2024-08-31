import { VSlickCarousel } from 'v-slick-carousel'
import 'v-slick-carousel/style.css'
import './style.scss'
import { h } from 'vue'
import { userEvent, waitFor, within } from '@storybook/test'

export default {
  component: VSlickCarousel,
  title: 'VSlickCarousel',
  tags: ['autodocs'],
  args: {
    default: defaultSlides,
    dots: true,
    infinite: false,
    groupsToShow: 1,
    slidesPerGroup: 1,
    groupsToScroll: 1,
    vertical: false,
    verticalSwiping: false,
    waitForAnimate: true
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
      description: 'Show the dots navigation'
    },
    infinite: {
      description: 'Infinite loop sliding'
    },
    groupsToShow: {
      description: 'Number of slide groups to show'
    },
    slidesPerGroup: {
      description: 'Number of slides to show per group'
    },
    groupsToScroll: {
      description: 'Number of groups to scroll'
    },
    vertical: {
      description: 'Switch to vertical sliding layout'
    },
    verticalSwiping: {
      description: 'Use vertical swiping'
    },
    waitForAnimate: {
      description: 'Wait for the current slide to animate before changing'
    }
  }
}

export const OneSlideFinite = {
  args: {
    default: defaultSlides()
  }
}

export const OneSlideFiniteInteractionTest = {
  ...OneSlideFinite,
  tags: ['!dev', '!autodocs'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('slide'))
    await userEvent.keyboard('[ArrowRight]')
    await waitFor(() => new Promise((resolve) => setTimeout(resolve, 1000)), {
      timeout: 1001
    })
    await userEvent.keyboard('[ArrowRight]')
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

function defaultSlides(num = 10) {
  return Array.from({ length: num }, (_, i) => {
    return h(
      'div',
      {
        key: i,
        class: 'slide',
        role: 'slide'
      },
      [
        h('h1', { class: 'no-swipe' }, `Slide ${i + 1}`),
        h('img', {
          src: `https://picsum.photos/400/200?random=${i}`,
          draggable: false
        }),
        h(
          'p',
          { class: 'no-swipe' },
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
        )
      ]
    )
  })
}
