<template>
  <div v-loading="loading">
    <el-select
      v-if="isClient"
      v-model="selected"
      size="large"
      placeholder="Example"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <template v-if="example">
      <h1 class="title">{{ example.name }}</h1>

      <div class="carousel">
        <VSlickCarousel
          ref="c1"
          v-bind="
            isAsNavFor
              ? { ...example.settings, asNavFor: c2 }
              : example.settings
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
      <template v-if="isAsNavFor">
        <prism language="typescript">{{ codeC1 }}</prism>
        <prism language="typescript">{{ codeC2 }}</prism>
      </template>
      <template v-else>
        <prism language="typescript">{{ exampleCode }}</prism>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { navigate } from 'vike/client/router'
import { usePageContext } from 'vike-vue/usePageContext'
import Prism from 'vue-prism-component'
import { VSlickCarousel } from '../../../lib/components'
import { codify } from '../../../src/utils'
import type { Example, ExampleOption } from '../../../src/types'
import {
  id as asNavForId,
  codeC1,
  codeC2
} from '../../../src/examples/as-nav-for'
import examples from '../../../src/examples'
const isClient = ref(false)
const loading = ref(false)
const c1 = ref()
const c2 = ref()
const pageContext = usePageContext()
const id = ref<string | null>(pageContext.routeParams.id || null)
const selected = ref<string | null>(null)
const exampleCode = ref<string | null>(null)
const example = computed<Example | null>(() => {
  if (!id.value) return null
  return Object.values(examples).find((o) => o.id === id.value)!
})
const options = computed<ExampleOption[]>(() =>
  Object.values(examples)
    .sort((o) => o.order)
    .map((o) => ({ label: o.name, value: o.id }))
)

const isAsNavFor = computed(() => example.value?.id === asNavForId)

onMounted(() => {
  isClient.value = true
})

watch(selected, async (newVal) => {
  if (!newVal) return
  loading.value = true
  await c1.value?.goTo(0, true)
  navigate(`/examples/${newVal}`)
  loading.value = false
})

watch(
  () => pageContext.routeParams.id,
  (newVal) => {
    if (!newVal) {
      id.value = Object.values(examples).sort((o) => o.order)[0].id
      selected.value = options.value.find((o) => o.value === id.value)!.value
      return
    }
    id.value = newVal
    selected.value = options.value.find((o) => o.value === id.value)!.value
  },
  { immediate: true }
)

watch(
  () => example.value?.settings,
  (newVal) => {
    if (newVal) {
      exampleCode.value = codify(newVal)
    }
  },
  { immediate: true }
)
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
    .v-slick-track.center & {
      display: none;
    }
  }
}
.heading {
  font-size: 18px;
}

@media screen and (min-width: 600px) {
  .slide {
    .text {
      .v-slick-track.center & {
        display: block;
      }
    }
  }
}
</style>
