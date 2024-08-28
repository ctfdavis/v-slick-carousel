import { VSlickCarousel } from 'v-slick-carousel'
import 'v-slick-carousel/style.css'
import { h } from 'vue'

export default {
  component: VSlickCarousel,
  title: 'VSlickCarousel',
  tags: ['autodocs'],
  args: {
    default: defaultSlides
  },
  argTypes: {
    default: {
      control: {
        type: 'text'
      },
      description: 'The default slot content.',
      table: {
        category: 'slots',
        type: {
          summary: 'any'
        }
      }
    }
  }
}

export const Default = {
  args: {
    default: defaultSlides
  }
}

function defaultSlides(num = 20) {
  return Array.from({ length: num }, (_, i) => {
    return h(
      'div',
      {
        key: i
      },
      [
        h('h1', {}, `Slide ${i + 1}`),
        h('p', {}, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
      ]
    )
  })
}
