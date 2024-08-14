import { VNode, h, Comment, Fragment, defineComponent } from 'vue'
import {
  VNode as VNode_3_1,
  h as h_3_1,
  Comment as Comment_3_1,
  Fragment as Fragment_3_1,
  defineComponent as defineComponent_3_1
} from 'vue-v3.1'
import {
  VNode as VNode_3_0,
  h as h_3_0,
  Comment as Comment_3_0,
  Fragment as Fragment_3_0,
  defineComponent as defineComponent_3_0
} from 'vue-v3.0'
import { extractSlides, getStatesOnSlide } from './carousel-utils'
import { OnSlideSpec } from '@lib/types'

describe('extractSlides', () => {
  describe('with Vue 3.2 or above', () => {
    let MyComponent: ReturnType<typeof defineComponent>
    beforeEach(() => {
      MyComponent = defineComponent({
        props: {
          msg: {
            type: String,
            default: ''
          }
        },
        setup(props) {
          return () => h('div', props.msg)
        }
      })
    })
    it('should return an array of non-fragment or comment slides', () => {
      const vnodes: VNode[] = [
        h('div'),
        h('a'),
        h(Fragment),
        h(Comment, 'comment'),
        h(MyComponent, { msg: 'hello' })
      ]
      expect(extractSlides(vnodes)).toHaveLength(3)
    })
  })
  describe('with Vue 3.1', () => {
    let MyComponent: ReturnType<typeof defineComponent_3_1>
    beforeEach(() => {
      MyComponent = defineComponent_3_1({
        props: {
          msg: {
            type: String,
            default: ''
          }
        },
        setup(props) {
          return () => h_3_1('div', props.msg)
        }
      })
    })
    it('should return an array of non-fragment or comment slides', () => {
      const vnodes: VNode_3_1[] = [
        h_3_1('div'),
        h_3_1('a'),
        h_3_1(Fragment_3_1),
        h_3_1(Comment_3_1, 'comment'),
        h_3_1(MyComponent, { msg: 'hello' })
      ]
      expect(extractSlides(vnodes as any)).toHaveLength(3)
    })
  })
  describe('with Vue 3.0', () => {
    let MyComponent: ReturnType<typeof defineComponent_3_0>
    beforeEach(() => {
      MyComponent = defineComponent_3_0({
        props: {
          msg: String
        },
        setup(props) {
          return () => h_3_0('div', props.msg)
        }
      })
    })
    it('should return an array of non-fragment or comment slides', () => {
      const vnodes: VNode_3_0[] = [
        h_3_0('div'),
        h_3_0('a'),
        h_3_0(Fragment_3_0),
        h_3_0(Comment_3_0, 'comment'),
        h_3_0(MyComponent, { msg: 'hello' })
      ]
      expect(extractSlides(vnodes as any)).toHaveLength(3)
    })
  })
})

describe('getStatesOnSlide', () => {
  it('should be undefined if both `waitForAnimate` and `animating` are true', () => {
    const spec: OnSlideSpec = {
      ...onSlideSpecBase,
      waitForAnimate: true,
      animating: true
    }
    expect(getStatesOnSlide(spec)).toBeUndefined()
  })
  it('should be undefined if `fade` is true, `infinite` is false and swiping to the edge on boundaries', () => {
    const spec: OnSlideSpec = {
      ...onSlideSpecBase,
      fade: true,
      infinite: false,
      index: -1,
      currentSlideGroupIndex: 0
    }
    expect(getStatesOnSlide(spec)).toBeUndefined()
  })
  it('should have empty afterSlidingState if `fade` is true and `useCSSTransitions` is false', () => {
    const spec: OnSlideSpec = {
      ...onSlideSpecBase,
      fade: false,
      useCSSTransitions: false,
      animating: false
    }
    expect(getStatesOnSlide(spec)?.afterSlidingState).toEqual({})
  })
  it('should not be undefined when `waitForAnimate` is false when swiping within the boundaries', () => {
    const spec: OnSlideSpec = {
      ...onSlideSpecBase,
      waitForAnimate: false,
      animating: false,
      index: 1,
      currentSlideGroupIndex: 0
    }
    expect(getStatesOnSlide(spec)).not.toBeUndefined()
  })
})

const onSlideSpecBase: OnSlideSpec = {
  animating: false,
  centerMode: false,
  centerPadding: '0px',
  currentSlideGroupIndex: 0,
  fade: false,
  groupsToShow: 1,
  groupsToScroll: 1,
  index: 0,
  infinite: false,
  lazyLoadedList: [],
  listWidth: 0,
  rtl: false,
  slideGroupCount: 1,
  slideGroupHeight: 0,
  slideGroupWidth: 0,
  trackEl: null as any,
  variableWidth: false,
  useCSSTransitions: true,
  vertical: false,
  waitForAnimate: false
}
