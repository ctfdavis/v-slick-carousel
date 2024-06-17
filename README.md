<div align="center">
<h1>Vue3SlickCarousel</h1>
</div>

A Vue 3 port of [vue-slick-carousel](https://github.com/gs-shop/vue-slick-carousel) enhanced with TypeScript support and additional features.

## API

### Props

Here is the reordered table:

| Name              | Type    | Default          | Description                                              |
| ----------------- | ------- | ---------------- | -------------------------------------------------------- |
| accessibility     | Boolean | `true`           | Enable accessibility.                                    |
| adaptiveHeight    | Boolean | `false`          | Enable adaptive height.                                  |
| arrows            | Boolean | `true`           | Show prev/next arrows.                                   |
| asNavFor          | String  | `''`             | Selector for another carousel to sync with.              |
| autoplay          | Boolean | `false`          | Enable autoplay.                                         |
| autoplaySpeed     | Number  | `3000`           | Autoplay interval in milliseconds.                       |
| centerMode        | Boolean | `false`          | Enable center mode.                                      |
| centerPadding     | String  | `'50px'`         | Center padding in pixels.                                |
| cssEase           | String  | `'ease'`         | CSS easing function.                                     |
| dots              | Boolean | `false`          | Show dots.                                               |
| dotsClass         | String  | `'v-slick-dots'` | Dots class name.                                         |
| draggable         | Boolean | `true`           | Enable dragging.                                         |
| easing            | String  | `'ease'`         | Easing function.                                         |
| edgeFriction      | Number  | `0.35`           | Edge friction.                                           |
| fade              | Boolean | `false`          | Enable fade mode.                                        |
| focusOnSelect     | Boolean | `false`          | Enable focus on select.                                  |
| groupsToScroll    | Number  | `1`              | Number of groups to scroll.                              |
| groupsToShow      | Number  | `1`              | Number of groups to show.                                |
| infinite          | Boolean | `true`           | Enable infinite mode.                                    |
| initialGroupIndex | Number  | `0`              | Initial group index.                                     |
| lazyLoad          | String  | `'ondemand'`     | Lazy load mode. Can be `'ondemand'`, or `'progressive'`. |
| nextArrowLabel    | String  | `'Next'`         | Next arrow label.                                        |
| pauseOnFocus      | Boolean | `true`           | Pause autoplay on focus.                                 |
| pauseOnHover      | Boolean | `true`           | Pause autoplay on hover.                                 |
| prevArrowLabel    | String  | `'Previous'`     | Previous arrow label.                                    |
| responsive        | Array   | `[]`             | Responsive settings.                                     |
| rtl               | Boolean | `false`          | Enable right-to-left mode.                               |
| slidesPerGroup    | Number  | `1`              | Number of slides per group.                              |
| speed             | Number  | `300`            | Transition speed in milliseconds.                        |
| swipe             | Boolean | `true`           | Enable swipe.                                            |
| swipeToSlide      | Boolean | `true`           | Enable swipe to slide.                                   |
| touchMove         | Boolean | `true`           | Enable touch move.                                       |
| touchThreshold    | Number  | `5`              | Touch threshold.                                         |
| useCSSTransitions | Boolean | `true`           | Use CSS transitions.                                     |
| useCSSTransform   | Boolean | `true`           | Use CSS transform.                                       |
| variableWidth     | Boolean | `false`          | Enable variable width.                                   |
| vertical          | Boolean | `false`          | Enable vertical mode.                                    |
| verticalSwiping   | Boolean | `false`          | Enable vertical swiping.                                 |
| waitForAnimate    | Boolean | `true`           | Wait for animation.                                      |

### License

Vue3SlickCarousel is open source and released under the [MIT License](./LICENSE).
