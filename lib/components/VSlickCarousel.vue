<template>
  <div
    :class="{ 'v-slick-vertical': settings.vertical }"
    class="v-slick-slider"
    dir="ltr"
  >
    <VSlickArrow v-if="settings.showDefaultArrows">
      <template v-slot:prevArrow="arrowSlotProps">
        <slot name="prevArrow" v-bind="arrowSlotProps"></slot>
      </template>
    </VSlickArrow>
    <!-- <div
      :class="{ 'v-slick-dragging': state.dragging }"
      class="v-slick-list"
      ref="vSlickListRef"
      :style="vSlickListStyle"
      @click="handleClickVSlickList"
      @mousedown="handleMouseDownVSlickList"
      @mouseup="handleMouseUpVSlickList"
      @mouseleave="handleMouseLeaveVSlickList"
      @mousemove="handleMouseMoveVSlickList"
      @touchstart.passive="handleTouchStartVSlickList"
      @touchmove.passive="handleTouchMoveVSlickList"
      @touchend="handleTouchEndVSlickList"
      @touchcancel="handleTouchCancelVSlickList"
      @keydown="handleKeyDownVSlickList"
    >
      <VSlickTrack ref="vSlickTrackRef"></VSlickTrack>
    </div> -->
    <VSlickArrow v-if="settings.showDefaultArrows">
      <template v-slot:nextArrow="arrowSlotProps">
        <slot name="nextArrow" v-bind="arrowSlotProps"></slot>
      </template>
    </VSlickArrow>
    <!-- <VSlickDots v-if="settings.showDefaultDots">
      <template v-slot:customPaging="paging"></template>
    </VSlickDots> -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Props } from '@lib/types'
import { canUseDOM, filterUndefined } from '@lib/utils'
import { defaultPropValues, defaultProps } from './props'
import enquireJs from 'enquire.js'
import json2mq from 'json2mq'
import VSlickArrow from './VSlickArrow.vue'
import VSlickTrack from './VSlickTrack.vue'

const enquire = canUseDOM() ? enquireJs : undefined

const props = defineProps(defaultProps) as Props
defineOptions({ inheritAttrs: false })

const breakpoint = ref<number>()

const settings = computed<Props>(() => {
  const definedProps = filterUndefined(props)
  let settings = { ...defaultPropValues, ...definedProps }
  if (breakpoint.value) {
    const newProps = props.responsive.find(
      (item) => item.breakpoint === breakpoint.value
    )
    settings = {
      ...settings,
      ...newProps?.settings
    }
  }
  // force scrolling by one group if 'centerMode' is enabled
  if (settings.centerMode) {
    if (settings.groupsToScroll > 1 && process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn(
        `centerMode is enabled: groupsToScroll should be 1; you are using ${settings.groupsToScroll}`
      )
    }
    settings.groupsToScroll = 1
  }
  // force showing one group and scrolling by one if `fade` is enabled
  if (settings.fade) {
    if (settings.groupsToShow > 1 && process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn(
        `fade is enabled: groupsToShow should be 1; you are using ${settings.groupsToShow}`
      )
    }
    if (settings.groupsToScroll > 1 && process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn(
        `fade is enabled: groupsToScroll should be 1; you are using ${settings.groupsToScroll}`
      )
    }
    settings.groupsToShow = 1
    settings.groupsToScroll = 1
  }
  // force disabling `variableWidth` if `slidesPerGroup` is bigger than 1
  if (settings.slidesPerGroup > 1) {
    if (settings.variableWidth && process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn(`slidesPerGroup is bigger than 1: variableWidth is disabled`)
    }
    settings.variableWidth = false
  }

  return settings
})

let responsiveMediaHandlers: {
  query: string
  handler: () => void
}[] = []

const media = (query: string, handler: () => void) => {
  if (!enquire) return

  enquire.register(query, handler)
  responsiveMediaHandlers.push({ query, handler })
}

const clearBreakpoints = () => {
  responsiveMediaHandlers.forEach(({ query, handler }) =>
    enquire?.unregister(query, handler)
  )
  responsiveMediaHandlers = []
}

const makeBreakpoints = () => {
  if (!props.responsive.length) return
  const breakpoints = props.responsive.map((item) => item.breakpoint)
  breakpoints.sort((a, b) => a - b)
  breakpoints.forEach((_breakpoint, index) => {
    const mediaQuery = json2mq({
      minWidth: index === 0 ? 0 : breakpoints[index - 1] + 1,
      maxWidth: _breakpoint
    })
    media(mediaQuery, () => {
      breakpoint.value = _breakpoint
    })
  })
  const query = json2mq({
    minWidth: breakpoints.slice(-1)[0]
  })
  media(query, () => {
    breakpoint.value = undefined
  })
}

watch(
  () => props,
  () => {
    clearBreakpoints()
    makeBreakpoints()
  },
  { deep: true }
)

makeBreakpoints()
</script>
