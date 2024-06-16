<script setup lang="ts">
import { VSlickCarousel } from '@lib/index'
import { Settings } from '@lib/types'
const settings: Settings = {
  dots: true,
  infinite: false,
  speed: 500,
  groupsToShow: 2,
  groupsToScroll: 1,
  slidesPerGroup: 2,
  vertical: true,
  verticalSwiping: true
}
</script>

<template>
  <div class="wrapper">
    <VSlickCarousel v-bind="settings" :style="{ height: '400px' }">
      <div class="slide" v-for="i in 13" :key="i">
        <img
          :src="`https://placehold.co/${10 * i}x${10 * i}?text=${i}`"
          alt="image"
        />
        <h3 class="no-swipe">{{ i }}</h3>
      </div>
    </VSlickCarousel>
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  padding: 28px;
  .slide {
    border: 1px solid #ccc;
    border-radius: 4px;
    height: 300px;
    h3 {
      padding: 20px;
      margin: 0 10px;
      text-align: center;
    }
  }
}
</style>
