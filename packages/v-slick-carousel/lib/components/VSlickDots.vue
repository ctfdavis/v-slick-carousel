<template>
  <ul
    class="v-slick-dots"
    style="display: block"
    @mouseenter="$emit('dotsLeave')"
    @mouseleave="$emit('dotsLeave')"
    @mouseover="$emit('dotsOver')"
  >
    <li
      v-for="i in pageCount"
      :key="i"
      :class="{ active: isActive(i - 1) }"
      @click="
        $emit('dotClick', {
          index: i - 1,
          groupsToScroll
        })
      "
    >
      <slot name="customPaging" :page="i - 1">
        <button>{{ i }}</button>
      </slot>
    </li>
  </ul>
</template>
<script setup lang="ts">
import { DotClickPayload } from '@lib/types'
import { defaultDotsProps } from './props'

defineEmits<{
  dotClick: [payload: DotClickPayload]
  dotsOver: []
  dotsLeave: []
}>()
const props = defineProps(defaultDotsProps)
const isActive = (i: number) => i === props.currentPage
</script>
