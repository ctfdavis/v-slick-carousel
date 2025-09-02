# Settings

## All settings

| Name                                                      | Type    | Default      | Description                                              |
|-----------------------------------------------------------|---------|--------------|----------------------------------------------------------|
| [accessibility](#accessibility)                           | Boolean | `true`       | Enable accessibility.                                    |
| [adaptiveHeight](#adaptiveheight)                         | Boolean | `false`      | Enable adaptive height.                                  |
| [arrows](#arrows)                                         | Boolean | `true`       | Show prev/next arrows.                                   |
| [asNavFor](#asnavfor)                                     | Object  | `undefined`  | Reference of another carousel to sync with.              |
| [autoplay](#autoplay)                                     | Boolean | `false`      | Enable autoplay.                                         |
| [autoplaySpeed](#autoplayspeed)                           | Number  | `3000`       | Autoplay interval in milliseconds.                       |
| [centerMode](#centermode)                                 | Boolean | `false`      | Enable center mode.                                      |
| [centerPadding](#centerpadding)                           | String  | `'50px'`     | Center padding in pixels.                                |
| [cssEase](#cssease)                                       | String  | `'ease'`     | CSS easing function.                                     |
| [dots](#dots)                                             | Boolean | `false`      | Show dots.                                               |
| [draggable](#draggable)                                   | Boolean | `true`       | Enable dragging.                                         |
| [edgeFriction](#edgefriction)                             | Number  | `0.35`       | Edge friction.                                           |
| [fade](#fade)                                             | Boolean | `false`      | Enable fade mode.                                        |
| [focusOnSelect](#focusonselect)                           | Boolean | `false`      | Enable focus on select.                                  |
| [groupsToScroll](#groupstoscroll)                         | Number  | `1`          | Number of groups to scroll.                              |
| [groupsToShow](#groupstoshow)                             | Number  | `1`          | Number of groups to show.                                |
| [ignorePrefersReducedMotion](#ignoreprefersreducedmotion) | Boolean | `false`      | Ignore `prefers-reduced-motion` .                        |
| [infinite](#infinite)                                     | Boolean | `true`       | Enable infinite mode.                                    |
| [infiniteLoopOnEdge](#infinitelooponedge)                 | Boolean | `false`      | Enable infinite loop on edge.                            |
| [initialGroupIndex](#initialgroupindex)                   | Number  | `0`          | Initial group index.                                     |
| [lazyLoad](#lazyload)                                     | String  | `'ondemand'` | Lazy load mode. Can be `'ondemand'`, or `'progressive'`. |
| [nextArrowLabel](#nextarrowlabel)                         | String  | `'Next'`     | Next arrow label.                                        |
| [pauseOnFocus](#pauseonfocus)                             | Boolean | `true`       | Pause autoplay on focus.                                 |
| [pauseOnHover](#pauseonhover)                             | Boolean | `true`       | Pause autoplay on hover.                                 |
| [prevArrowLabel](#prevarrowlabel)                         | String  | `'Previous'` | Previous arrow label.                                    |
| [responsiveBehavior](#responsivebehavior)                 | String  | `'mobile-first'`| How responsive queries behave                         |
| [responsive](#responsive)                                 | Array   | `[]`         | Responsive settings.                                     |
| [rtl](#rtl)                                               | Boolean | `false`      | Enable right-to-left mode.                               |
| [slidesPerGroup](#slidespergroup)                         | Number  | `1`          | Number of slides per group.                              |
| [speed](#speed)                                           | Number  | `300`        | Transition speed in milliseconds.                        |
| [swipe](#swipe)                                           | Boolean | `true`       | Enable swipe.                                            |
| [swipeToSlide](#swipetoslide)                             | Boolean | `true`       | Enable swipe to slide.                                   |
| [touchMove](#touchmove)                                   | Boolean | `true`       | Enable touch move.                                       |
| [touchThreshold](#touchthreshold)                         | Number  | `5`          | Touch threshold.                                         |
| [unslick](#unslick)                                       | Boolean | `false`      | Unslick the carousel.                                    |
| [useCSSTransitions](#usecsstransitions)                   | Boolean | `true`       | Use CSS transitions.                                     |
| [useCSSTransform](#usecsstransform)                       | Boolean | `true`       | Use CSS transform.                                       |
| [variableWidth](#variablewidth)                           | Boolean | `false`      | Enable variable width.                                   |
| [vertical](#vertical)                                     | Boolean | `false`      | Enable vertical mode.                                    |
| [verticalSwiping](#verticalswiping)                       | Boolean | `false`      | Enable vertical swiping.                                 |
| [waitForAnimate](#waitforanimate)                         | Boolean | `true`       | Wait for animation.                                      |
| [widthDetection](#widthdetection)                         | String  | `auto`       | Use manual or automatic width detection.                 |

## `accessibility` <Badge type="info" text="boolean" />

<small>Default: `true`</small>

When `true`, the component can be navigated using the keyboard arrow keys.

## `adaptiveHeight` <Badge type="info" text="boolean" />

<small>Default: `false`</small>

When `true`, the height of the carousel will change based on the displayed slide groups' height in the slide track.

## `arrows` <Badge type="info" text="boolean" />

<small>Default: `true`</small>

When `true`, the previous and next arrows will be shown.

## `asNavFor` <Badge type="info" text="object" />

<small>Default: `undefined`</small>

[Reference](https://vuejs.org/guide/essentials/template-refs.html) of another carousel to sync with.
See [As Nav For](/examples/as-nav-for) example.

## `autoplay` <Badge type="info" text="boolean" />

<small>Default: `false`</small>

When `true`, the carousel will automatically advance to the next slide. See [Auto Play](/examples/auto-play) example.

## `autoplaySpeed` <Badge type="info" text="number" />

<small>Default: `3000`</small>

Autoplay interval in milliseconds. See [Auto Play](/examples/auto-play) example.

## `centerMode` <Badge type="info" text="boolean" />

<small>Default: `false`</small>

When `true`, the carousel will be in center mode. See [Center Mode](/examples/center-mode) example.

## `centerPadding` <Badge type="info" text="string" />

<small>Default: `'50px'`</small>

Padding applied to the sides of the slide track in pixels or other valid CSS length units for center mode.
See [Center Mode](/examples/center-mode) example.

## `cssEase` <Badge type="info" text="string" />

<small>Default: `'ease'`</small>

CSS easing function for the animation.

## `dots` <Badge type="info" text="boolean" />

<small>Default: `false`</small>

When `true`, the dots (for pagination) will be shown.

## `draggable` <Badge type="info" text="boolean" />

<small>Default: `true`</small>

When `true`, the carousel will be draggable by mouse. See also [`touchMove`](#touchmove) and [`swipe`](#swipe).

## `edgeFriction` <Badge type="info" text="number" />

<small>Default: `0.35`</small>

Edge friction for swiping. The value should be between `0` and `1`.

## `fade` <Badge type="info" text="boolean" />

<small>Default: `false`</small>

When `true`, the carousel will be in fade mode. See [Fade](/examples/fade) example.

## `focusOnSelect` <Badge type="info" text="boolean" />

<small>Default: `false`</small>

When `true`, the slide will be focused on select (i.e. clicked). See [Focus On Select](/examples/focus-on-select)
example.

## `groupsToScroll` <Badge type="info" text="number" />

<small>Default: `1`</small>

Number of groups to scroll when navigating. See [Two Slide Groups Finite](/examples/two-slide-groups-finite) example.

## `groupsToShow` <Badge type="info" text="number" />

<small>Default: `1`</small>

Number of groups to show. See [Concept](/guide/concept) for more details.

## `ignorePrefersReducedMotion` <Badge type="info" text="boolean" />

<small>Default: `false`</small>

When `true`, the carousel will ignore [
`prefers-reduced-motion` settings](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) by
adding `!important` to the CSS transitions for the animation to show as expected.

## `infinite` <Badge type="info" text="boolean" />

<small>Default: `true`</small>

When `true`, the carousel will be in infinite mode. See [One Slide Group Infinite](/examples/one-slide-group-infinite)
example.

## `infiniteLoopOnEdge` <Badge type="info" text="boolean" />

<small>Default: `false`</small>

When `true`, the carousel will loop infinitely on the edge. See [Infinite Loop On Edge](/examples/infinite-loop-on-edge)

## `initialGroupIndex` <Badge type="info" text="number" />

<small>Default: `0`</small>

Initial group index: the index of the group that will be shown first on initial render.

## `lazyLoad` <Badge type="info" text="string" />

<small>Default: `undefined`</small>

Lazy load mode. Can be `'ondemand'`, or `'progressive'`.

The `ondemand` mode will only load the next slide when it is in view. The `progressive` mode will load all slides
sequentially on initial render. See [Lazy Load](/examples/lazy-load) example.

## `nextArrowLabel` <Badge type="info" text="string" />

<small>Default: `'Next'`</small>

Next arrow label (for accessibility).

## `pauseOnFocus` <Badge type="info" text="boolean" />

<small>Default: `true`</small>

Pause autoplay when a slide is focused.

## `pauseOnHover` <Badge type="info" text="boolean" />

<small>Default: `true`</small>

Pause autoplay on hover. See [Auto Play](/examples/auto-play) example.

## `prevArrowLabel` <Badge type="info" text="string" />

<small>Default: `'Previous'`</small>

Previous arrow label (for accessibility).

## `responsiveBehavior` <Badge type="info" text="string" />

<small>Default: `'mobile-first'`</small>

Defines how to apply responsive settings.

With `'mobile-first'` the default settings are for mobile view and the responsive options apply for the repesctive breakpoints as a `'min-width'` rule.
With `'desktop-first'` the default settings are for desktop view and the responsive options apply for the respective breakpoints as a `'max-width'` rule.

## `responsive` <Badge type="info" text="array" />

<small>Default: `[]`</small>

Responsive settings. It has the below type:

```ts
{
    breakpoint: number
    settings: Partial<Omit<Settings, 'responsive'>>
}
```

For example, if you want to make the carousel show more groups above 480px, you can do the following:

```ts
{
    groupsToShow: 1,
        responsive
:
    [
        {
            breakpoint: 480, // i.e. (min-width: 480px); 480px or more will use the below settings
            settings: {
                groupsToShow: 2
            }
        }
    ]
}
```

See [Responsive](/examples/responsive) example.

## `rtl` <Badge type="info" text="boolean" />

<small>Default: `false`</small>

Enable right-to-left mode. See [rtl](/examples/rtl) example.

## `slidesPerGroup` <Badge type="info" text="number" />

<small>Default: `1`</small>

Number of slides to show in one group. See [Concept](/guide/concept) for more details.

## `speed` <Badge type="info" text="number" />

<small>Default: `300`</small>

Slide navigation's animation speed in milliseconds.

## `swipe` <Badge type="info" text="boolean" />

<small>Default: `true`</small>

When `false`, the carousel will not be draggable by both touch and mouse.

## `swipeToSlide` <Badge type="info" text="boolean" />

<small>Default: `false`</small>

When `true`, one can swipe to a particular slide by dragging the track. See [Swipe To Slide](/examples/swipe-to-slide)
example.

## `touchMove` <Badge type="info" text="boolean" />

<small>Default: `true`</small>

Enable dragging by touch. See also [`draggable`](#draggable) and [`swipe`](#swipe).

## `touchThreshold` <Badge type="info" text="number" />

<small>Default: `5`</small>

The bigger the number is, the more sensitive the touch move will be.

## `unslick` <Badge type="info" text="boolean" />

<small>Default: `false`</small>

When `true`, the carousel functionality will be disabled. This is useful when you want to show the carousel as a static display.

## `useCSSTransitions` <Badge type="info" text="boolean" />

<small>Default: `true`</small>

Enable CSS transitions.

## `useCSSTransform` <Badge type="info" text="boolean" />

<small>Default: `true`</small>

Enable CSS transform.

## `variableWidth` <Badge type="info" text="boolean" />

<small>Default: `false`</small>

When `true`, the slide groups can have different widths based on their slide content.

## `vertical` <Badge type="info" text="boolean" />

<small>Default: `false`</small>

When `true`, the carousel will be in vertical mode. See [Vertical](/examples/vertical) example.

## `verticalSwiping` <Badge type="info" text="boolean" />

<small>Default: `false`</small>

Typically used together with [`vertical`](#vertical). When `true`, the swipe direction of the carousel becomes vertical.
See [Vertical](/examples/vertical) example.

## `waitForAnimate` <Badge type="info" text="boolean" />

<small>Default: `true`</small>

When `true`, navigation will be disabled until the animation is complete.

## `widthDetection` <Badge type="info" text="string" />

<small>Default: `'auto'`</small>

The `widthDetection` property influences how the carousel adjusts its width. This property supports two modes: `auto`
and `manual`.

In `auto` mode, the carousel dynamically expands to occupy the full width of its parent element. This mode ensures the
smoothest performance during window resizing events.

However, `auto` mode may cause the carousel to scale to infinity if the parent element does not have fixed width. This
often arises in flex or grid layouts. In such cases, you can fix this problem by either setting a fixed width for the
parent element or switching to `manual` mode.

In `manual` mode, a width detection step is executed to determine the carousel's width. This mode ensures that the
carousel fills its parent element adequately both on mount and after every window resize event.
See [Flex Layout](/examples/flex-layout) for an example.

For additional information on this topic, refer to this [FAQ](/guide/faq#carousel-scales-to-infinity).
