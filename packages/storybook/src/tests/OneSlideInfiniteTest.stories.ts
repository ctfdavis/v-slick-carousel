import { userEvent, waitFor, within } from '@storybook/test'
import { OneSlideInfinite } from '../VSlickCarousel.stories.ts'
import { argInfo } from '../common.ts'
import { VSlickCarousel } from 'v-slick-carousel'

export default {
  component: VSlickCarousel,
  tags: [],
  ...argInfo
}

export const OneSlideInfiniteTest = {
  ...OneSlideInfinite,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('slide'))
    await waitFor(() => new Promise((resolve) => setTimeout(resolve, 1000)), {
      timeout: 1001
    })
    await userEvent.keyboard('[ArrowLeft]')
    await waitFor(() => new Promise((resolve) => setTimeout(resolve, 1000)), {
      timeout: 1001
    })
    await userEvent.keyboard('[ArrowLeft]')
    await waitFor(() => new Promise((resolve) => setTimeout(resolve, 1000)), {
      timeout: 1001
    })
    await userEvent.keyboard('[ArrowRight]')
    await waitFor(() => new Promise((resolve) => setTimeout(resolve, 1000)), {
      timeout: 1001
    })
    await userEvent.keyboard('[ArrowRight]')
    await waitFor(() => new Promise((resolve) => setTimeout(resolve, 1000)), {
      timeout: 1001
    })
    await userEvent.keyboard('[ArrowRight]')
  }
}
