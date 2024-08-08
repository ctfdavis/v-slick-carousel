<template>
  <div
    class="v-slick-track"
    :class="{ center: centerMode, vertical: vertical }"
    :style="trackStyle"
  >
    <div
      v-for="(slideGroup, i) in preCloneSlideGroups"
      :key="slideGroup.key"
      tabindex="-1"
      :class="slideGroup.class"
      :style="slideGroup.style"
      class="v-slick-slide-group clone"
      v-bind="slideGroup.attrs"
      @click="slideGroup.onClick"
    >
      <component
        :is="slide"
        v-for="(slide, j) of slideGroup.slides"
        :key="`slide-${i}-${j}` + (slide.key ? `-${String(slide.key)}` : '')"
      />
    </div>
    <div
      v-for="(slideGroup, i) in originalSlideGroups"
      :key="slideGroup.key"
      tabindex="-1"
      class="v-slick-slide-group"
      :class="slideGroup.class"
      :style="slideGroup.style"
      v-bind="slideGroup.attrs"
      @click="slideGroup.onClick"
    >
      <component
        :is="slide"
        v-for="(slide, j) of slideGroup.slides"
        :key="`slide-${i}-${j}` + (slide.key ? `-${String(slide.key)}` : '')"
      />
    </div>
    <div
      v-for="(slideGroup, i) in postCloneSlideGroups"
      :key="slideGroup.key"
      tabindex="-1"
      :class="slideGroup.class"
      :style="slideGroup.style"
      class="v-slick-slide-group clone"
      v-bind="slideGroup.attrs"
      @click="slideGroup.onClick"
    >
      <component
        :is="slide"
        v-for="(slide, j) of slideGroup.slides"
        :key="`slide-${i}-${j}` + (slide.key ? `-${String(slide.key)}` : '')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
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
    isCurrent = false,
    centerOffset: number
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

      const left = props.rtl
        ? index * slideGroupWidth
        : -index * slideGroupWidth
      style.left = `${left}px`
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
    if (props.ignorePrefersReducedMotion) {
      style.transition += ' !important'
    }
  }

  return style
}

const originalSlideGroups = computed<SlideGroup[]>(() => {
  const slideGroups = props.rawSlideGroups.map((rawSlideGroup, index) => {
    const style = getSlideGroupStyle(index)
    const classes = getSlideGroupClasses(index)
    if (props.fade && classes.includes('active')) {
      Object.assign(style, { zIndex: 1 })
    }
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
        emit('childClick', {
          index:
            props.rtl && props.infinite ? props.slideGroupCount + index : index
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
  // return props.rtl ? slideGroups.reverse() : slideGroups
  return slideGroups
})

const preCloneSlideGroups = computed<SlideGroup[]>(() => {
  if (
    !props.infinite ||
    props.fade ||
    props.slideGroupCount <= props.groupsToShow
  ) {
    return []
  }
  const slideGroups = props.rawSlideGroups
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
        },
        onClick: () => {
          emit('childClick', {
            index: key
          })
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
  // return props.rtl ? slideGroups.reverse() : slideGroups
  return slideGroups
})

const postCloneSlideGroups = computed<SlideGroup[]>(() => {
  if (
    !props.infinite ||
    props.fade ||
    props.slideGroupCount <= props.groupsToShow
  ) {
    return []
  }
  const slideGroups = props.rawSlideGroups.map((rawSlideGroup, index) => {
    const key = props.slideGroupCount + index
    const slideGroup: SlideGroup = {
      slides: [],
      key: `postclone-${key}`,
      class: getSlideGroupClasses(key),
      style: getSlideGroupStyle(index),
      attrs: {
        'data-index': key,
        'aria-hidden': 'true'
      },
      onClick: () => {
        emit('childClick', {
          index: props.rtl ? props.slideGroupCount + key : key
        })
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
  // return props.rtl ? slideGroups.reverse() : slideGroups
  return slideGroups
})
</script>

<style scoped lang="scss">
.v-slick-track {
  position: relative;
  top: 0;
  left: 0;
  display: flex;
  transform: translate3d(0, 0, 0);
  &.center {
    margin-left: auto;
    margin-right: auto;
  }
  &.vertical {
    flex-direction: column;
    .v-slick-slide-group {
      flex-direction: row;
      height: auto;
      & > * {
        flex-grow: 1;
      }
    }
  }
  &.dragging img {
    pointer-events: none;
  }
}
.v-slick-slide-group {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 1px;
  flex-shrink: 0;
  outline: none;
}
</style>
