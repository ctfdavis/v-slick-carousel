import { ResponsiveInfiniteFiniteEdgeCases } from '../../VSlickCarousel.stories.ts'
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
  ...ResponsiveInfiniteFiniteEdgeCases,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const slides = canvas.getAllByRole('slide')
    await userEvent.click(slides[0])
    await wait(1000)
    await userEvent.keyboard('[ArrowLeft]')
  }
}
