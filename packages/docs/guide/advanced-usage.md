---
next: false
---

# Advanced Usage

## Using slots for custom arrows and dots templates

If you find that you cannot style the arrows and dots the way you want using CSS, you can provide custom template for them.

For arrows, use the `prevArrow` and `nextArrow` slots. These slots expose `arrowSlotProps` which contains the below properties:

```ts
{
    currentSlideGroupIndex: number; // current slide group index
    slideGroupCount: number; // total slide group count
    disabled: boolean; // true if the previous or next arrow is disabled
    onClick: () => void; // navigation callback when the arrow is clicked
}
```

For example, here is a custom template for the previous arrow:

```vue
<template>
  <VSlickCarousel>
    <template #prevArrow="arrowSlotProps">
      <div @click="arrowSlotProps.onClick" :disabled="arrowSlotProps.disabled">
        my custom prev arrow
      </div>
    </template>
    <!-- slides -->
  </VSlickCarousel>
</template>
```

For dots, use the `customPaging` slot. This slot exposes `paging` which contains the below properties:

```ts
{
  page: number // page index
}
```

For example, here is a custom template for showing the page numbers instead of dots:

```vue
<template>
  <VSlickCarousel>
    <template #customPaging="paging">
      <div>{{ paging.page + 1 }}</div>
    </template>
    <!-- slides -->
  </VSlickCarousel>
</template>
```

The page elements provided in the slot will automatically register click events that handle the navigation.

In some circumstances, providing custom template is not enough because you want
to place the arrows or dots in an entirely different place. In these cases, see
[the below section](#using-ref-to-access-the-component-state-and-methods) on
using `ref` to access the component state and methods to construct your own arrows and dots outside of the component.

## Using `ref` to access the component state and methods

Using `ref` on the component will expose below component's state and methods:

```ts
{
    goto: (index: number) => void; // navigates to the slide group at the given index
    next: () => void; // navigates to the next slide group
    prev: () => void; // navigates to the previous slide group
    play: () => void; // starts autoplay
    pause: () => void; // stops autoplay
    autoPlay: (playType: PlayingType | keyof typeof PlayingType) => void // changes autoplay status
    slideGroupCount: number; // total slide group count
    currentSlideGroupIndex: number; // current slide group index
    currentGroupsToShow: number; // current groups to show
    pageCount: number; // total page count
}
```

In the above, the `PlayingType` enum is an exported member of the library and defined as below:

```ts
enum PlayingType {
  play = 'play',
  playing = 'playing',
  paused = 'paused',
  hovered = 'hovered',
  focused = 'focused',
  update = 'update',
  leave = 'leave',
  blur = 'blur'
}
```

## Events emitted by the component

The following events are emitted by the component:

- `init`: triggered when the component is initialized
- `beforeChange`: triggered before the slide group is changed (e.g. right after a swipe started)
- `afterChange`: triggered after the slide group is changed (e.g. after a swipe ended)
- `lazyLoad`: triggered when some slide groups are being lazily loaded; contains a payload of the slide groups to lazy load (i.e. an array of slide group indexes)
- `lazyLoadError`: triggered when any slide group fails to lazy load
- `reInit`: triggered when the component is reinitialized
- `edge`: triggered when the slide group reaches the edge; contains a payload of the swipe direction
- `swipe`: triggered when the slide group is swiped; contains a payload of the swipe direction

## Using `.no-swipe` class to disable swipe on certain elements

You can use the `.no-swipe` class to disable swipe on certain elements in the slides. For example, there may be certain elements in a slide, such as images and videos, that you do not want to be swiped on. You can add the `.no-swipe` class to those elements to disable any swipe action on them:

```vue
<template>
  <VSlickCarousel>
    <div class="slide slide--1">
      <img src="https://placehold.co/600x400?text=1" class="no-swipe" />
      <p>Slide 1</p>
    </div>
    <div class="slide slide--2">
      <img src="https://placehold.co/600x400?text=2" class="no-swipe" />
      <p>Slide 2</p>
    </div>
    <div class="slide slide--3">
      <img src="https://placehold.co/600x400?text=3" class="no-swipe" />
      <p>Slide 3</p>
    </div>
  </VSlickCarousel>
</template>
```
