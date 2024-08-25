import { h } from 'vue'
import { mount } from '@vue/test-utils'
import VSlickCarousel from './VSlickCarousel.vue'
import { expect } from 'vitest'

// hide the unnecessary warning on invoking slot "default" outside of the render function:
// https://github.com/vuejs/test-utils/issues/2409
vi.spyOn(console, 'warn').mockImplementation(() => {})

const basicSlides = (total) =>
  Array.from({ length: total }, (_, i) => h('div', `basic slide ${i + 1}`))

const SlideComponent = {
  props: ['msg'],
  template: '<div>{{ msg }}</div>'
}

const componentSlides = (total) =>
  Array.from({ length: total }, (_, i) =>
    h(SlideComponent, { msg: `component slide ${i + 1}` })
  )

describe('VSlickCarousel', () => {
  describe('Slide rendering', () => {
    it('should render basic slides', () => {
      const wrapper = mount(VSlickCarousel, {
        slots: {
          default: basicSlides(20)
        }
      })
      Array.from({ length: 20 }).forEach((_, i) => {
        expect(wrapper.text()).toContain(`basic slide ${i + 1}`)
      })
    })

    it('should render component slides', () => {
      const wrapper = mount(VSlickCarousel, {
        slots: {
          default: componentSlides(20)
        }
      })
      Array.from({ length: 20 }).forEach((_, i) => {
        expect(wrapper.text()).toContain(`component slide ${i + 1}`)
      })
    })
  })

  describe('Arrows and dots rendering', () => {
    it('should render the carousel with arrows when `arrows:true`', () => {
      const wrapper = mount(VSlickCarousel, {
        slots: {
          default: basicSlides(20)
        },
        props: {
          arrows: true
        }
      })
      expect(wrapper.find('.v-slick-arrow.prev').exists()).toBe(true)
      expect(wrapper.find('.v-slick-arrow.next').exists()).toBe(true)
    })
    it('should not render the carousel with arrows when `arrows:false`', () => {
      const wrapper = mount(VSlickCarousel, {
        slots: {
          default: basicSlides
        },
        props: {
          arrows: false
        }
      })
      expect(wrapper.find('.v-slick-arrow.prev').exists()).toBe(false)
      expect(wrapper.find('.v-slick-arrow.next').exists()).toBe(false)
    })
    it('should render the carousel with right number of dots when `dots:true`', () => {
      const wrapper = mount(VSlickCarousel, {
        slots: {
          default: basicSlides(20)
        },
        props: {
          dots: true,
          groupsToShow: 1,
          slidesPerGroup: 1
        }
      })
      expect(wrapper.find('.v-slick-dots').exists()).toBe(true)
      expect(wrapper.findAll('.v-slick-dots > *')).toHaveLength(20)
    })
    it('should not render the carousel with dots when `dots:false`', () => {
      const wrapper = mount(VSlickCarousel, {
        slots: {
          default: basicSlides
        },
        props: {
          dots: false
        }
      })
      expect(wrapper.find('.v-slick-dots').exists()).toBe(false)
    })
  })

  describe('Current slide', () => {
    function makeWrapper(props) {
      return mount(VSlickCarousel, {
        slots: {
          default: basicSlides(20)
        },
        props
      })
    }
    function expectCurrentSlideGroup(wrapper, indices) {
      Array.from({ length: 20 }).forEach((_, i) => {
        const exp = expect(
          wrapper.findAll('.v-slick-slide-group:not(.clone)').at(i).classes()
        )
        if (indices.includes(i)) {
          exp.toContain('current')
        } else {
          exp.not.toContain('current')
        }
      })
    }
    describe('One slide group to show', () => {
      it('should set the first slide group as current', () => {
        const wrapper = makeWrapper({
          initialGroupIndex: 0
        })
        expectCurrentSlideGroup(wrapper, [0])
      })
      it('should set the the 10th slide group as current', () => {
        const wrapper = makeWrapper({
          initialGroupIndex: 9
        })
        expectCurrentSlideGroup(wrapper, [9])
      })
    })
    describe('Multiple slide groups to show', () => {
      it('should set the first slide group as current', () => {
        const wrapper = makeWrapper({
          initialGroupIndex: 0,
          groupsToShow: 3
        })
        expectCurrentSlideGroup(wrapper, [0])
      })
      it('should set the the 10th slide group as current', () => {
        const wrapper = makeWrapper({
          initialGroupIndex: 9,
          groupsToShow: 3
        })
        expectCurrentSlideGroup(wrapper, [9])
      })
    })
  })
})
