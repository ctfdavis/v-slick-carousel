<template>
  <template v-if="type === SlideNavigation.previous">
    <slot name="prevArrow" v-bind="arrowSlotProps">
      <button
        type="button"
        data-role="none"
        class="v-slick-arrow prev"
        :class="{ disabled }"
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
        :class="{ disabled }"
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
const clickHandler = computed(() => () => {
  if (props.disabled) return
  emit(props.type)
})
const arrowSlotProps = computed<ArrowSlotProps>(() => ({
  currentSlideGroupIndex: props.currentSlideGroupIndex,
  slideGroupCount: props.slideGroupCount,
  onClick: clickHandler.value,
  disabled: !props.disabled
}))
</script>
<style scoped>
.v-slick-arrow {
  display: block;
}
</style>
