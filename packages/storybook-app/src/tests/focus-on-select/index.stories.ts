import { userEvent, within } from '@storybook/test'
import { FocusOnSelect } from '../../VSlickCarousel.stories.ts'
import { argInfo } from '../../common.ts'
import { VSlickCarousel } from 'v-slick-carousel'
import { wait } from '../utils.ts'

export default {
  component: VSlickCarousel,
  tags: [],
  ...argInfo
}

export const Test = {
  ...FocusOnSelect,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await wait(1000)
    await userEvent.click(canvas.getAllByText('Slide 2')[0])
    await wait(1000)
    await userEvent.click(canvas.getAllByText('Slide 4')[0])
    await wait(1000)
    await userEvent.click(canvas.getAllByText('Slide 4')[0])
  }
}
