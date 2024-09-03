import { userEvent, waitFor, within } from '@storybook/test'
import { FocusOnSelect } from '../VSlickCarousel.stories.ts'
import { argInfo } from '../common.ts'
import { VSlickCarousel } from 'v-slick-carousel'

export default {
  component: VSlickCarousel,
  tags: [],
  ...argInfo
}

export const FocusOnSelectTest = {
  ...FocusOnSelect,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await waitFor(() => new Promise((resolve) => setTimeout(resolve, 1000)), {
      timeout: 1001
    })
    await userEvent.click(canvas.getAllByText('Slide 2')[0])
    await waitFor(() => new Promise((resolve) => setTimeout(resolve, 1000)), {
      timeout: 1001
    })
    await userEvent.click(canvas.getAllByText('Slide 4')[0])
    await waitFor(() => new Promise((resolve) => setTimeout(resolve, 1000)), {
      timeout: 1001
    })
    await userEvent.click(canvas.getAllByText('Slide 4')[0])
  }
}
