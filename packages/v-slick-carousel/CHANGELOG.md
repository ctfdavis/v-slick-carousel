# v-slick-carousel

## 0.6.4

### Patch Changes

- Fix: change touch end and cancel event listeners to non-passive
- Fix: add event cancelable checks

## 0.6.3

### Patch Changes

- Fixed responsive autoplay not resuming
- Fixed `unslick` should display autoplay and certain settings
- Fixed `infiniteLoopOnEdge` not working properly with slide group counts less than groups to show

## 0.6.2

### Patch Changes

- Added `infiniteLoopOnEdge` option

## 0.6.1

### Patch Changes

- Fixed slides missing if slide group count is less than groups to show

## 0.6.0

### Minor Changes

- Added `unslick` option
- Fixed pagination and navigation logic to properly handle edge cases in various modes

## 0.5.0

### Minor Changes

- Removed all dependencies:
    - `lodash.debounce`
    - `@dcufo/enquire.js`
    - `json2mq`
- Switched responsive settings to use min-width queries

## 0.4.2

### Patch Changes

- Fixed edge cases when switching between infinite and finite via responsive settings

## 0.4.1

### Patch Changes

- Fix different `groupsToShow` responsive values in `infinite` mode would cause incorrect slide groups to display

## 0.4.0

### Minor Changes

- Fix scroll not locking when swiping on mobile
- Add e2e tests
- Remove `dotsClass` setting

## 0.3.3

### Patch Changes

- Remove `lodash.pick` & `lodash.clonedeep` packages
- Add `build:watch` script for documentation development

## 0.3.2

### Patch Changes

- Fix `waitForAnimate: false` not working properly
- Fix `lazyLoadedList` not properly mutated
- Refactor `getStatesOnSlide`
- Add tests for `getStatesOnSlide`

## 0.3.1

### Patch Changes

- Fix last slide group could not be displayed and navigated to in `centerMode`
- Share & expose navigation logic (`canGoNext` & `canGoPrev`)

## 0.3.0

### Minor Changes

- Add `widthDetection` setting to fix infinite scaling

## 0.2.2

### Patch Changes

#### Bug Fixes

- Fix aria-hidden errors in fade mode
- Fix wrong aria-hidden on edge slides in infinite mode

#### Others

- Add Contributing section in README

## 0.2.1

### Patch Changes

- Fix `ignorePrefersReducedMotion` in `fade` mode

## 0.2.0

### Minor Changes

- Add an option `ignorePrefersReducedMotion` to force CSS transition animation by overriding the settings in
  `prefers-reduced-motion` media query.

## 0.1.2

### Patch Changes

- Fix TouchEvent not defined in some browsers;
- Fix edgeFriction performance degradation in some browsers;
- Clear selection on dragging & moving the carousel to improve UX;
- Only register event listeners on carousel as needed;
- Add documentation section in readme

## 0.1.1

### Patch Changes

- 7339417: Update readme
