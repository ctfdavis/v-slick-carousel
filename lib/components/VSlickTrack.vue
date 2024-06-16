<template>
  <div
    class="v-slick-track"
    :class="{ 'v-slick-center': centerMode, 'v-slick-vertical': vertical }"
    :style="trackStyle"
    ref="trackRef"
  >
    <div
      v-for="(slideGroup, i) in props.rtl
        ? postCloneSlideGroups
        : preCloneSlideGroups"
      :key="slideGroup.key"
      class="v-slick-slide-group clone"
    >
      <component
        v-for="(slide, j) of slideGroup.slides"
        :is="slide"
        :key="`slide-${i}-${j}` + (slide.key ? `-${String(slide.key)}` : '')"
      />
    </div>
    <div
      v-for="(slideGroup, i) in originalSlideGroups"
      :key="slideGroup.key"
      class="v-slick-slide-group"
      v-bind="slideGroup.attrs"
      :class="slideGroup.class"
      :style="slideGroup.style"
      @click="slideGroup.onClick"
    >
      <component
        v-for="(slide, j) of slideGroup.slides"
        :is="slide"
        :key="`slide-${i}-${j}` + (slide.key ? `-${String(slide.key)}` : '')"
      />
    </div>
    <div
      v-for="(slideGroup, i) in props.rtl
        ? preCloneSlideGroups
        : postCloneSlideGroups"
      :key="slideGroup.key"
      class="v-slick-slide-group clone"
    >
      <component
        v-for="(slide, j) of slideGroup.slides"
        :is="slide"
        :key="`slide-${i}-${j}` + (slide.key ? `-${String(slide.key)}` : '')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { defaultTrackProps } from './props'
import {
  ChildClickPayload,
  CloneInfoSpec,
  LazyInfoSpec,
  SlideGroup,
  TrackProps
} from '@lib/types'
import {
  getLazyEndIndex,
  getLazyStartIndex,
  getTotalPreClones
} from '@lib/utils'

const props = defineProps(defaultTrackProps) as TrackProps
const emit = defineEmits<{
  childClick: [payload: ChildClickPayload]
}>()

const getSlideGroupClasses = (index: number) => {
  let isActive = false,
    isCenter = false,
    isCloned = false,
    isCurrent = false,
    centerOffset: number
  if (props.rtl) index = props.slideGroupCount - 1 - index
  isCloned = index < 0 || index >= props.slideGroupCount
  if (props.centerMode) {
    centerOffset = Math.floor(props.groupsToShow / 2)
    isCenter =
      (index - props.currentSlideGroupIndex) % props.slideGroupCount === 0
    if (
      index > props.currentSlideGroupIndex - centerOffset - 1 &&
      index <= props.currentSlideGroupIndex + centerOffset
    ) {
      isActive = true
    }
  } else {
    isActive =
      props.currentSlideGroupIndex <= index &&
      index < props.currentSlideGroupIndex + props.groupsToShow
  }
  isCurrent = index === props.currentSlideGroupIndex
  return Object.entries({
    active: isActive,
    center: isCenter,
    cloned: isCloned,
    current: isCurrent
  })
    .filter(([, value]) => value)
    .map(([key]) => key)
}

const getSlideGroupStyle = (index: number) => {
  let style: {
    width?: string
    position?: string
    top?: string
    left?: string
    opacity?: number
    transition?: string
  } = {}

  if (props.variableWidth === undefined || props.variableWidth === false) {
    style.width =
      typeof props.slideGroupWidth === 'number'
        ? `${props.slideGroupWidth}px`
        : props.slideGroupWidth
  }

  if (props.fade) {
    style.position = 'relative'
    if (props.vertical) {
      const slideGroupHeight = !props.slideGroupHeight
        ? 0
        : typeof props.slideGroupHeight === 'string'
          ? parseFloat(props.slideGroupHeight)
          : props.slideGroupHeight
      style.top = `${-index * slideGroupHeight}px`
    } else {
      const slideGroupWidth = !props.slideGroupWidth
        ? 0
        : typeof props.slideGroupWidth === 'string'
          ? parseFloat(props.slideGroupWidth)
          : props.slideGroupWidth
      style.left = `${-index * slideGroupWidth}px`
    }
    style.opacity = props.currentSlideGroupIndex === index ? 1 : 0
    style.transition =
      'opacity ' +
      props.speed +
      'ms ' +
      props.cssEase +
      ', ' +
      'visibility ' +
      props.speed +
      'ms ' +
      props.cssEase
  }

  return style
}

const trackRef = ref<HTMLElement>()
const offsetWidth = ref(0)

const originalSlideGroups = computed<SlideGroup[]>(() => {
  return props.rawSlideGroups.map((rawSlideGroup, index) => {
    const style = getSlideGroupStyle(index)
    const classes = getSlideGroupClasses(index)
    const slideGroup: SlideGroup = {
      slides: [],
      key: `original-${index}`,
      class: classes,
      style,
      attrs: {
        'data-index': index,
        'aria-hidden': `${!classes.includes('active')}`
      },
      onClick: () => {
        if (!classes.includes('active')) return
        emit('childClick', {
          index
        })
      }
    }
    if (
      !props.lazyLoad ||
      (props.lazyLoad && props.lazyLoadedList.indexOf(index) >= 0)
    ) {
      slideGroup.slides = rawSlideGroup
    }
    return slideGroup
  })
})

const preCloneSlideGroups = computed<SlideGroup[]>(() => {
  if (
    !props.infinite ||
    props.fade ||
    props.slideGroupCount <= props.groupsToShow
  ) {
    return []
  }
  return props.rawSlideGroups
    .map((rawSlideGroup, index) => {
      const preCloneNo = props.slideGroupCount - index
      if (preCloneNo > getTotalPreClones(props as CloneInfoSpec)) return
      const key = -preCloneNo
      const slideGroup: SlideGroup = {
        slides: [],
        key: `preclone-${key}`,
        class: getSlideGroupClasses(key),
        style: getSlideGroupStyle(index),
        attrs: {
          'data-index': key,
          'aria-hidden': 'true'
        }
      }
      if (
        key >= getLazyStartIndex(props as LazyInfoSpec) ||
        !props.lazyLoad ||
        (props.lazyLoad && props.lazyLoadedList.indexOf(index) >= 0)
      ) {
        slideGroup.slides = rawSlideGroup
      }
      return slideGroup
    })
    .filter((slideGroup) => slideGroup) as SlideGroup[]
})

const postCloneSlideGroups = computed<SlideGroup[]>(() => {
  if (
    !props.infinite ||
    props.fade ||
    props.slideGroupCount <= props.groupsToShow
  ) {
    return []
  }
  return props.rawSlideGroups.map((rawSlideGroup, index) => {
    const key = props.slideGroupCount + index
    const slideGroup: SlideGroup = {
      slides: [],
      key: `postclone-${key}`,
      class: getSlideGroupClasses(key),
      style: getSlideGroupStyle(index),
      attrs: {
        'data-index': key,
        'aria-hidden': 'true'
      }
    }
    if (
      key < getLazyEndIndex(props as LazyInfoSpec) ||
      !props.lazyLoad ||
      (props.lazyLoad && props.lazyLoadedList.indexOf(index) >= 0)
    ) {
      slideGroup.slides = rawSlideGroup
    }
    return slideGroup
  })
})

onMounted(() => {
  offsetWidth.value = trackRef.value?.offsetWidth || 0
})

defineExpose({
  offsetWidth
})
</script>
