# v-slick-carousel

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

- Add an option `ignorePrefersReducedMotion` to force CSS transition animation by overriding the settings in `prefers-reduced-motion` media query.

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
