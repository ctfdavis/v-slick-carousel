<!-- for development -->
<script setup lang="ts">
import { VSlickCarousel } from '@lib/index'
import { Settings } from '@lib/types'
const settings: Settings = {
  dots: true
}
</script>

<template>
  <div class="wrapper">
    <VSlickCarousel v-bind="settings">
      <div v-for="i in 100" :key="i" class="slide">
        <h3>
          <span class="no-swipe">
            {{ i }}
          </span>
        </h3>
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
