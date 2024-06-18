<template>
  <ul
    :class="dotsClass"
    style="display: block"
    @mouseenter="$emit('dotsLeave')"
    @mouseleave="$emit('dotsLeave')"
    @mouseover="$emit('dotsOver')"
  >
    <li
      v-for="i in dotCount"
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
import { computed } from 'vue'
import { defaultDotsProps } from './props'
defineEmits<{
  dotClick: [payload: DotClickPayload]
  dotsOver: []
  dotsLeave: []
}>()
const props = defineProps(defaultDotsProps)
const dotCount = computed(() => {
  if (props.infinite) {
    return Math.ceil(props.slideGroupCount / props.groupsToScroll)
  }
  const dotsCount = Math.ceil(
      (props.slideGroupCount - props.groupsToShow) / props.groupsToScroll
    ) + 1
  
  return dotsCount < 0 ? 0 : dotsCount
})
const isActive = (i: number) => {
  const leftBound = i * props.groupsToScroll
  const rightBound = leftBound + props.groupsToScroll - 1
  return (
    props.currentSlideGroupIndex >= leftBound &&
    props.currentSlideGroupIndex <= rightBound
  )
}
</script>
