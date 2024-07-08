<template>
  <div>
    <VSlickCarousel>
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

<script setup lang="ts">
import { VSlickCarousel } from "vue-3-slick-carousel";
import "./node_modules/vue-3-slick-carousel/dist/style.css";
</script>
