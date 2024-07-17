<template>
  <q-select v-model="selected" outlined :options="options" label="Example" />
  <template v-if="example">
    <h1 class="title">{{ example.name }}</h1>

    <div class="carousel">
      <VSlickCarousel v-bind="example.settings">
        <div class="slide" v-for="slide of example.slides" :key="slide.text">
          <img class="img no-swipe" :src="slide.img" />
          <p class="text">{{ slide.text }}</p>
        </div>
      </VSlickCarousel>
    </div>
    <pre>{{ exampleCode }}</pre>
  </template>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { VSlickCarousel } from '@lib/components'
import { codify } from './utils'
import type { Example, ExampleOption } from './types'
import examples from './examples'
const router = useRouter()
const route = useRoute()
const id = computed<string | null>(() => route.path.split('/')?.[2] || null)
const selected = ref<ExampleOption | null>(null)
const example = computed<Example | null>(() => {
  if (!id.value) return null
  return examples[id.value]
})
const options = computed<ExampleOption[]>(() =>
  Object.values(examples)
    .sort((o) => o.order)
    .map((o) => ({ label: o.name, value: o.id }))
)
const exampleCode = computed(() =>
  example.value?.settings ? codify(example.value?.settings) : ''
)

selected.value = options.value.find((o) => o.value === id.value)!

watch(selected, (newVal) => {
  if (!newVal) return
  router.push({
    name: newVal.value
  })
})
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
