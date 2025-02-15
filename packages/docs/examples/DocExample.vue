<script setup lang="ts">
import examples from '../src/examples'
import { withBase } from 'vitepress'
import { createHighlighter } from 'shiki'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import 'v-slick-carousel/style.css'
import { VSlickCarousel } from 'v-slick-carousel'
import { codify, mobileCheck } from '../src/utils'
import { id as asNavForId, codeC1, codeC2 } from '../src/examples/as-nav-for'
import { id as flexLayoutId } from '../src/examples/flex-layout'

const props = defineProps({
  id: String
})
const c1 = ref()
const c2 = ref()
const isAsNavFor = props.id === asNavForId
const isFlexLayout = props.id === flexLayoutId
const example = Object.values(examples).find((o) => o.id === props.id)
const exampleCode = ref()
const asNavForExampleCode1 = ref()
const asNavForExampleCode2 = ref()
const isMobile = ref(false)
let highlighter

onMounted(async () => {
  isMobile.value = mobileCheck()
  if (!example.settings) return
  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: ['nord'],
      langs: ['javascript']
    })
  }
  if (props.id === asNavForId) {
    asNavForExampleCode1.value = highlighter.codeToHtml(codeC1, {
      theme: 'nord',
      lang: 'javascript'
    })
    asNavForExampleCode2.value = highlighter.codeToHtml(codeC2, {
      theme: 'nord',
      lang: 'javascript'
    })
    return
  }
  exampleCode.value = highlighter.codeToHtml(codify(example.settings), {
    theme: 'nord',
    lang: 'javascript'
  })
})

onBeforeUnmount(() => {
  highlighter?.dispose()
  highlighter = null
})
</script>

<template v-if="example">
  <div :class="isFlexLayout && $style.flex">
    <div :class="$style.carousel">
      <VSlickCarousel
        ref="c1"
        v-bind="
          isAsNavFor ? { ...example.settings, asNavFor: c2 } : example.settings
        "
      >
        <div
          :class="$style.slide"
          v-for="slide of example.slides"
          :key="slide.text"
        >
          <img
            :class="[$style.img, !isMobile && 'no-swipe']"
            class="img"
            :src="withBase(slide.img)"
          />
          <p :class="[$style.text, !isMobile && 'no-swipe']">
            {{ slide.text }}
          </p>
        </div>
      </VSlickCarousel>
    </div>
    <div v-if="isAsNavFor || isFlexLayout" :class="$style.carousel">
      <VSlickCarousel
        ref="c2"
        v-bind="{
          ...example.settings,
          ...(isAsNavFor ? { groupsToShow: 6, asNavFor: c1 } : {})
        }"
      >
        <div
          :class="$style.slide"
          v-for="slide of example.slides"
          :key="slide.text"
        >
          <img
            :class="[$style.img, !isMobile && 'no-swipe']"
            class="img"
            :src="withBase(slide.img)"
          />
          <p :class="[$style.text, !isMobile && 'no-swipe']">
            {{ slide.text }}
          </p>
        </div>
      </VSlickCarousel>
    </div>
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

<style module lang="scss">
.flex {
  display: flex;
  gap: 24px;

  & > * {
    width: 50%;
  }
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
  overflow: auto;
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
