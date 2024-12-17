<template>
  <ul
    class="v-slick-dots"
    style="display: block"
    @mouseleave="$emit('leave')"
    @mouseover="$emit('over')"
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
  over: []
  leave: []
}>()
const props = defineProps(defaultDotsProps)
const isActive = (i: number) => {
  const leftBound = i * props.groupsToScroll
  const rightBound = leftBound + props.groupsToScroll - 1
  return (
    props.currentSlideGroupIndex >= leftBound &&
    props.currentSlideGroupIndex <= rightBound
  )
}
</script>
