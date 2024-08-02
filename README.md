<div align="center">
<h1>Vue 3 Slick Carousel</h1>
<img src="./packages/docs/public/logo.svg" alt="Vue 3 Slick Carousel" />
</div>

A Carousel component with TypeScript support and numerous features made for Vue 3.

## Features

Vue 3 Slick Carousel is a carousel component with TypeScript support and features including the following:

- Vue 3 suppoort (Vue 2 is not supported)
- Multiple slides per group
- Responsiveness
- Lazy loading
- Vertical mode
- Auto play
- Pagination
- Accessibility via keyboard navigation
- Right-to-left support
- SSR support
- Typescript support

See [Why Vue 3 Slick Carousel](./packages/docs/guide/why-vue-3-slick-carousel.md) for more details.

## Installation

```bash
npm install vue-3-slick-carousel
```

See [Installation](./packages/docs/guide/installation.md) for more details.

## Quick Start

```vue
<template>
  <div class="carousel">
    <VSlickCarousel v-bind="settings">
      <div>Slide 1</div>
      <div>Slide 2</div>
      <div>Slide 3</div>
    </VSlickCarousel>
  </div>
</template>

<script setup lang="ts">
import 'vue-3-slick-carousel/style.css'
import { VSlickCarousel } from 'vue-3-slick-carousel'
import type { Settings } from 'vue-3-slick-carousel'

const settings: Settings = {
  slidesToShow: 1
  // ...
}
</script>

<style scoped>
.carousel {
  padding: 28px;
}
</style>
```

## Settings

See [Settings](./packages/docs/guide/settings.md).

## License

Vue 3 Slick Carousel is open source and released under the [MIT License](./LICENSE).
