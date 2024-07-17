import { Settings } from '@lib/types'

export type Example = {
  id: string
  name: string
  settings: Settings
  slides: ExampleSlide[]
  order: number
}

export type ExampleOption = {
  label: string
  value: string
}

export type ExampleSlide = {
  img: string
  text: string
}
