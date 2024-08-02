---
prev: false
next: false
aside: false
---

<template v-if="example">
    <h1 :class="$style.title">{{ example.name }}</h1>
    <div :class="$style.carousel">
      <VSlickCarousel
          ref="c1"
          v-bind="
          isAsNavFor
              ? { ...example.settings, asNavFor: c2 }
              : example.settings
          "
      >
          <div :class="$style.slide" v-for="slide of example.slides" :key="slide.text">
              <img :class="$style.img" class="img no-swipe" :src="withBase(slide.img)" />
              <p :class="$style.text">{{ slide.text }}</p>
          </div>
      </VSlickCarousel>
    </div>
    <div v-if="isAsNavFor" :class="$style.carousel">
      <VSlickCarousel
          ref="c2"
          v-bind="{ ...example.settings, groupsToShow: 6, asNavFor: c1 }"
      >
          <div :class="$style.slide" v-for="slide of example.slides" :key="slide.text">
          <img :class="$style.img" class="no-swipe" :src="withBase(slide.img)" />
          <p :class="$style.text">{{ slide.text }}</p>
          </div>
      </VSlickCarousel>
    </div>
    <h3 :class="$style.heading">Settings</h3>
    <template v-if="isAsNavFor">
      <div v-html="asNavForExampleCode1" :class="$style.code"></div>
      <div v-html="asNavForExampleCode2" :class="$style.code"></div>
    </template>
    <template v-else>
      <div v-html="exampleCode" :class="$style.code"></div>
    </template>
</template>

<script setup>
import examples from '../src/examples'
import { useData, useRouter, withBase } from 'vitepress'
import { createHighlighter } from 'shiki'
import { ref, onMounted } from 'vue'
import 'vue-3-slick-carousel/style.css'
import { VSlickCarousel } from 'vue-3-slick-carousel'
import { codify } from '../src/utils'
import {
  id as asNavForId,
  codeC1,
  codeC2
} from '../src/examples/as-nav-for'

const { params } = useData()
const router = useRouter()

if (params.value.id === 'index') {
    router.go(withBase(`/examples/${Object.entries(examples).sort(([_, v]) => v.order)[0][0]}`))
}

const c1 = ref()
const c2 = ref()
const isAsNavFor = params.value.id === asNavForId
const example = Object.values(examples).find((o) => o.id === params.value.id)
const exampleCode = ref()
const asNavForExampleCode1 = ref()
const asNavForExampleCode2 = ref()

onMounted(async () => {
  if (!example.settings) return
  const highlighter = await createHighlighter({
    themes: ['nord'],
    langs: ['javascript'],
  })
  if (params.value.id === asNavForId) {
    asNavForExampleCode1.value = highlighter.codeToHtml(codeC1, {
      theme: 'nord',
      lang: 'javascript',
    })
    asNavForExampleCode2.value = highlighter.codeToHtml(codeC2, {
      theme: 'nord',
      lang: 'javascript',
    })
    return
  }
  exampleCode.value = highlighter.codeToHtml(codify(example.settings), {
    theme: 'nord',
    lang: 'javascript',
  }) 
})
</script>

<style module lang="scss">
.title {
  font-size: 20px;
  text-align: center;
}
.carousel {
  margin-top: 24px;
  padding: 0 32px;
  :global(.v-slick-arrow:before) {
    color: #ccc;
  }
  :global(.v-slick-dots li button:before) {
    color: var(--vp-c-text-1);
  }
}
.slide {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 18px 0;
  .img {
    max-width: 70%;
  }
  .text {
    font-size: 18px;
    font-weight: 600;
    text-align: center;
    :global(.v-slick-track.center) & {
      display: none;
    }
  }
}
.heading {
  font-size: 18px;
}
.code > pre {
  padding: 12px;
  border-radius: 4px;
}

@media screen and (min-width: 600px) {
  .slide {
    .text {
      :global(.v-slick-track.center) & {
        display: block;
      }
    }
  }
}
</style>
