<script setup lang="ts">
import { VSlickCarousel } from '@lib/index'
import { Settings } from '@lib/types'
const settings: Settings = {
  dots: true,
  infinite: true,
  speed: 500,
  groupsToShow: 3,
  groupsToScroll: 1,
  slidesPerGroup: 2,
  focusOnSelect: true,
  rtl: true
  // responsive: [
  //   {
  //     breakpoint: 1024,
  //     settings: {
  //       groupsToShow: 3,
  //       groupsToScroll: 3,
  //       slidesPerGroup: 3
  //     }
  //   },
  //   {
  //     breakpoint: 600,
  //     settings: {
  //       groupsToShow: 2,
  //       groupsToScroll: 2,
  //       slidesPerGroup: 2
  //     }
  //   }
  // ],
}
</script>

<template>
  <div class="wrapper">
    <VSlickCarousel v-bind="settings">
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
    height: 200px;
    h3 {
      padding: 20px;
      margin: 0 10px;
      text-align: center;
    }
  }
}
</style>
