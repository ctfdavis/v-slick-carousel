<template>
  <template v-if="type === SlideNavigation.previous">
    <slot name="prevArrow" v-bind="arrowSlotProps">
      <button
        type="button"
        data-role="none"
        class="v-slick-arrow prev"
        :class="{ disabled: !clickable }"
        @click="clickHandler"
      >
        {{ prevArrowLabel }}
      </button>
    </slot>
  </template>
  <template v-else>
    <slot name="nextArrow" v-bind="arrowSlotProps">
      <button
        type="button"
        data-role="none"
        class="v-slick-arrow next"
        :class="{ disabled: !clickable }"
        @click="clickHandler"
      >
        {{ nextArrowLabel }}
      </button>
    </slot>
  </template>
</template>
<script setup lang="ts">
import { ArrowSlotProps, SlideNavigation } from '@lib/types'
import { computed } from 'vue'
import { defaultArrowProps } from './props'

const props = defineProps(defaultArrowProps)
const emit = defineEmits([SlideNavigation.previous, SlideNavigation.next])
const clickable = computed(() => {
  if (props.infinite) return true
  if (props.type === SlideNavigation.previous)
    return (
      props.currentSlideGroupIndex !== 0 &&
      props.slideGroupCount > props.groupsToShow
    )
  return (
    (!props.centerMode ||
      props.currentSlideGroupIndex < props.slideGroupCount - 1) &&
    props.slideGroupCount > props.groupsToShow &&
    props.currentSlideGroupIndex < props.slideGroupCount - props.groupsToShow
  )
})
const clickHandler = computed(() => () => {
  if (!clickable.value) return
  emit(props.type)
})
const arrowSlotProps = computed<ArrowSlotProps>(() => ({
  currentSlideGroupIndex: props.currentSlideGroupIndex,
  slideGroupCount: props.slideGroupCount,
  onClick: clickHandler.value,
  disabled: !clickable.value
}))
</script>
<style scoped>
.v-slick-arrow {
  display: block;
}
</style>
