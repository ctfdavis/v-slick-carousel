import type { Settings } from 'v-slick-carousel'

export type Example = {
  id: string
  name: string
  settings: Settings
  slides: ExampleSlide[]
}

export type OrderedExample = {
  order: number
} & Example

export type ExampleOption = {
  label: string
  value: string
}

export type ExampleSlide = {
  img: string
  text: string
}
