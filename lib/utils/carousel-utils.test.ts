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
import { extractSlides } from './carousel-utils'

describe('extractSlides', () => {
  describe('with Vue 3.2 or above', () => {
    let MyComponent: ReturnType<typeof defineComponent>
    beforeEach(() => {
      MyComponent = defineComponent({
        props: {
          msg: String
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
          msg: String
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
