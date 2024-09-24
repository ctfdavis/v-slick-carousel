import { userEvent, within } from '@storybook/test'
import { OneSlideFinite } from '../../VSlickCarousel.stories.ts'
import { argInfo } from '../../common.ts'
import { VSlickCarousel } from 'v-slick-carousel'
import { wait } from '../utils.ts'

export default {
  component: VSlickCarousel,
  tags: [],
  ...argInfo
}

export const Test = {
  ...OneSlideFinite,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('slide'))
    await wait(1000)
    await userEvent.keyboard('[ArrowRight]')
    await wait(1000)
    await userEvent.keyboard('[ArrowRight]')
    await wait(1000)
    await userEvent.keyboard('[ArrowLeft]')
    await wait(1000)
    await userEvent.keyboard('[ArrowLeft]')
    await wait(1000)
    await userEvent.keyboard('[ArrowLeft]')
  }
}
