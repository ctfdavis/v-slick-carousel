# Styling

The recommended way to style the component is to wrap it in a `div` tag with a class name of your choice. For example, in [Basic Usage](/guide/basic-usage), the `VSlickCarousel` component is wrapped in a `div` tag with the class name `carousel`. This allows one to easily style the component with a higher level of specificity to override the default styles.

## Styling the slides

Styling the slides is easy because one provides the slides as a children of the `VSlickCarousel` component. For example, one can give the slides class names to style them:

```vue
<template>
  <div class="carousel">
    <VSlickCarousel>
      <div class="slide slide--1">Slide 1</div>
      <div class="slide slide--2">Slide 2</div>
      <div class="slide slide--3">Slide 3</div>
    </VSlickCarousel>
  </div>
</template>

<script setup lang="ts">
import 'v-slick-carousel/style.css'
import { VSlickCarousel } from 'v-slick-carousel'
</script>

<style scoped>
.carousel {
  padding: 28px;
}
.slide {
  border: 1px solid #ccc;
}
.slide--1 {
  background-color: red;
}
.slide--2 {
  background-color: green;
}
.slide--3 {
  background-color: blue;
}
</style>
```

### Styling the current slide group

> The **current slide group** refers to the slide group that is the leftmost visible slide group in horizontal and left-to-right mode. In center mode, the current slide group would the center slide group.

To style the current slide group, one can use the `current` class name. **Slide groups** have the `v-slick-slide-group` class name. Therefore, to style the slide(s) in the current slide group, one can use a selector like `.carousel :deep(.v-slick-slide-group.current) .slide`:

```vue
<template>
  <div class="carousel">
    <VSlickCarousel>
      <div class="slide slide--1">Slide 1</div>
      <div class="slide slide--2">Slide 2</div>
      <div class="slide slide--3">Slide 3</div>
    </VSlickCarousel>
  </div>
</template>

<script setup lang="ts">
import 'v-slick-carousel/style.css'
import { VSlickCarousel } from 'v-slick-carousel'
</script>

<style scoped>
.carousel {
  padding: 28px;
}
.carousel :deep(.v-slick-slide-group.current) .slide {
  background-color: red;
}
</style>
```

## Styling the arrows

When using only the base styles, the arrows may not be visible as they are positioned `-25px` away from the slide track. To fix this, one can add padding to the `div` wrapper of the `VSlickCarousel` component:

```vue
<template>
  <div class="carousel">
    <VSlickCarousel>
      <!-- slides -->
    </VSlickCarousel>
  </div>
</template>

<script setup lang="ts">
import 'v-slick-carousel/style.css'
import { VSlickCarousel } from 'v-slick-carousel'
</script>

<style scoped>
.carousel {
  padding: 28px;
}
</style>
```

To style the arrows (e.g. change the color or icons), one can use the `.v-slick-arrow:before` selector like below:

```vue
<template>
  <div class="carousel">
    <VSlickCarousel>
      <!-- slides -->
    </VSlickCarousel>
  </div>
</template>

<script setup lang="ts">
import 'v-slick-carousel/style.css'
import { VSlickCarousel } from 'v-slick-carousel'
</script>

<style scoped>
.carousel {
  padding: 28px;
}

.carousel :deep(.v-slick-arrow:before) {
  color: red;
}
</style>
```

## Styling the dots

To style the dots, one can use the `.v-slick-dots` selector like below. The active dot (an `li` element) will have the `active` class name.

```vue
<template>
  <div class="carousel">
    <VSlickCarousel v-bind="{ dots: true }">
      <!-- slides -->
    </VSlickCarousel>
  </div>
</template>

<script setup lang="ts">
import 'v-slick-carousel/style.css'
import { VSlickCarousel } from 'v-slick-carousel'
</script>

<style scoped>
.carousel {
  padding: 28px;
}

.carousel :deep(.v-slick-dots li button:before) {
  color: red;
}

.carousel :deep(.v-slick-dots li.active button:before) {
  color: blue;
}
```
