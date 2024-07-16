<template>
  <h1 class="title">{{ example.name }}</h1>

  <div class="carousel">
    <VSlickCarousel :settings="example.settings">
      <div class="slide" v-for="slide of example.slides" :key="slide.text">
        <img class="img no-swipe" :src="slide.img" />
        <p class="text">{{ slide.text }}</p>
      </div>
    </VSlickCarousel>
  </div>
  <pre>{{ stringfiedSettings }}</pre>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { VSlickCarousel } from '@lib/components'
import { codify } from './utils'
import examples from './examples'
const route = useRoute()
const id = route.path.split('/')[2]
const example = examples[id]
const stringfiedSettings = codify(example.settings)
</script>

<style lang="scss">
.title {
  font-size: 20px;
  text-align: center;
}
.carousel {
  padding: 0 32px;
  .v-slick-arrow:before {
    color: #ccc;
  }
}
.slide {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 18px 0;
  background: #fff;
  .img {
    max-width: 70%;
  }
  .text {
    font-size: 18px;
    font-weight: 600;
  }
}
</style>
