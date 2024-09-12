import { h } from 'vue'

export function defaultSlides(num = 10) {
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

export const argInfo = {
  args: {
    default: defaultSlides(),
    dots: true,
    infinite: false,
    groupsToShow: 1,
    slidesPerGroup: 1,
    groupsToScroll: 1,
    vertical: false,
    verticalSwiping: false,
    waitForAnimate: true,
    lazyLoad: undefined,
    responsive: [],
    focusOnSelect: false
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
    },
    lazyLoad: {
      description: 'Strategies to lazy load slides',
      table: {
        type: {
          summary: 'string'
        }
      },
      options: [undefined, 'ondemand', 'progressive'],
      control: {
        type: 'select'
      }
    },
    responsive: {
      description: 'Responsive settings',
      table: {
        type: {
          summary: 'Array<{ breakpoint: number; settings: Partial<Settings>; }>'
        }
      }
    },
    focusOnSelect: {
      description: 'Focus on (navigate to) slide when selected'
    }
  }
}
