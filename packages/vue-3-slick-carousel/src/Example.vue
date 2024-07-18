<template>
  <q-select v-model="selected" outlined :options="options" label="Example" />
  <template v-if="example">
    <h1 class="title">{{ example.name }}</h1>

    <div class="carousel">
      <VSlickCarousel
        ref="c1"
        v-bind="
          isAsNavFor ? { ...example.settings, asNavFor: c2 } : example.settings
        "
      >
        <div class="slide" v-for="slide of example.slides" :key="slide.text">
          <img class="img no-swipe" :src="slide.img" />
          <p class="text">{{ slide.text }}</p>
        </div>
      </VSlickCarousel>
    </div>
    <div v-if="isAsNavFor" class="carousel">
      <VSlickCarousel
        ref="c2"
        v-bind="{ ...example.settings, groupsToShow: 6, asNavFor: c1 }"
      >
        <div class="slide" v-for="slide of example.slides" :key="slide.text">
          <img class="img no-swipe" :src="slide.img" />
          <p class="text">{{ slide.text }}</p>
        </div>
      </VSlickCarousel>
    </div>
    <h3 class="heading">Settings</h3>
    <pre>{{ exampleCode }}</pre>
  </template>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { VSlickCarousel } from '@lib/components'
import { codify, markAsObj } from './utils'
import type { Example, ExampleOption } from './types'
import { id as asNavForId } from './examples/as-nav-for'
import examples from './examples'
import cloneDeep from 'lodash.clonedeep'
const c1 = ref()
const c2 = ref()
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

const isAsNavFor = computed(() => example.value?.id === asNavForId)

const exampleCode = computed(() => {
  const settings = cloneDeep<any>(example.value?.settings)
  if (settings && isAsNavFor.value) {
    settings.asNavFor = markAsObj('c2')
  }
  return settings ? codify(settings) : ''
})

selected.value = options.value.find((o) => o.value === id.value)!

watch(selected, (newVal) => {
  if (!newVal) return
  c1.value?.goTo(0, true)
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
    text-align: center;
  }
}
.heading {
  font-size: 18px;
}
</style>
