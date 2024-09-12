import { TwoSlideGroupsFinite } from '../../VSlickCarousel.stories.ts'
import { argInfo } from '../../common.ts'
import { VSlickCarousel } from 'v-slick-carousel'
import { userEvent, within } from '@storybook/test'
import { wait } from '../utils.ts'

export default {
  component: VSlickCarousel,
  tags: [],
  ...argInfo
}

export const Test = {
  ...TwoSlideGroupsFinite,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getAllByRole('slide')[0])
    await wait(1000)
    await userEvent.keyboard('[ArrowRight]')
    await wait(1000)
    await userEvent.keyboard('[ArrowRight]')
  }
}
