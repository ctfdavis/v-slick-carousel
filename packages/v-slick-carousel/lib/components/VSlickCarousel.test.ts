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
  describe('Slide group rendering', () => {
    describe('Content rendering', () => {
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
    describe('Current & active slide group', () => {
      function makeWrapper(props) {
        return mount(VSlickCarousel, {
          slots: {
            default: basicSlides(20)
          },
          props
        })
      }

      function expectSlideGroupWithClassName(wrapper, indices, className) {
        Array.from({ length: 20 }).forEach((_, i) => {
          const exp = expect(
            wrapper.findAll('.v-slick-slide-group:not(.clone)').at(i).classes()
          )
          if (indices.includes(i)) {
            exp.toContain(className)
          } else {
            exp.not.toContain(className)
          }
        })
      }

      describe('One slide group to show', () => {
        it('should set the first slide group as current', () => {
          const wrapper = makeWrapper({
            initialGroupIndex: 0
          })
          expectSlideGroupWithClassName(wrapper, [0], 'current')
        })
        it('should set the first slide group as active', () => {
          const wrapper = makeWrapper({
            initialGroupIndex: 0
          })
          expectSlideGroupWithClassName(wrapper, [0], 'active')
        })
        it('should set the the 10th slide group as current', () => {
          const wrapper = makeWrapper({
            initialGroupIndex: 9
          })
          expectSlideGroupWithClassName(wrapper, [9], 'current')
        })
        it('should set the the 10th slide group as active', () => {
          const wrapper = makeWrapper({
            initialGroupIndex: 9
          })
          expectSlideGroupWithClassName(wrapper, [9], 'active')
        })
      })
      describe('Multiple slide groups to show', () => {
        it('should set the first slide group as current', () => {
          const wrapper = makeWrapper({
            initialGroupIndex: 0,
            groupsToShow: 3
          })
          expectSlideGroupWithClassName(wrapper, [0], 'current')
        })
        it('should set the first three slide groups as active', () => {
          const wrapper = makeWrapper({
            initialGroupIndex: 0,
            groupsToShow: 3
          })
          expectSlideGroupWithClassName(wrapper, [0, 1, 2], 'active')
        })
        it('should set the the 10th slide group as current', () => {
          const wrapper = makeWrapper({
            initialGroupIndex: 9,
            groupsToShow: 3
          })
          expectSlideGroupWithClassName(wrapper, [9], 'current')
        })
        it('should set the the 10th, 11th, 12th slide groups as active', () => {
          const wrapper = makeWrapper({
            initialGroupIndex: 9,
            groupsToShow: 3
          })
          expectSlideGroupWithClassName(wrapper, [9, 10, 11], 'active')
        })
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

  describe('Navigation', () => {
    describe('Arrow navigation', () => {
      it('should navigate to the next slide group when clicking the next arrow', async () => {
        const wrapper = mount(VSlickCarousel, {
          slots: {
            default: basicSlides(20)
          },
          props: {
            arrows: true
          }
        })
        expect(wrapper.find('.v-slick-slide-group.current').text()).toContain(
          'basic slide 1'
        )
        await wrapper.find('.v-slick-arrow.next').trigger('click')
        expect(wrapper.find('.v-slick-slide-group.current').text()).toContain(
          'basic slide 2'
        )
      })
      it('should navigate to the previous slide group when clicking the prev arrow', async () => {
        const wrapper = mount(VSlickCarousel, {
          slots: {
            default: basicSlides(20)
          },
          props: {
            arrows: true,
            initialGroupIndex: 1
          }
        })
        expect(wrapper.find('.v-slick-slide-group.current').text()).toContain(
          'basic slide 2'
        )
        await wrapper.find('.v-slick-arrow.prev').trigger('click')
        expect(wrapper.find('.v-slick-slide-group.current').text()).toContain(
          'basic slide 1'
        )
      })
      describe('Edge cases', () => {
        describe('Finite mode', () => {
          it('should not navigate to the next slide group when clicking the next arrow at the last slide group', async () => {
            const wrapper = mount(VSlickCarousel, {
              slots: {
                default: basicSlides(20)
              },
              props: {
                arrows: true,
                initialGroupIndex: 19,
                infinite: false
              }
            })
            expect(
              wrapper.find('.v-slick-slide-group.current').text()
            ).toContain('basic slide 20')
            await wrapper.find('.v-slick-arrow.next').trigger('click')
            expect(
              wrapper.find('.v-slick-slide-group.current').text()
            ).toContain('basic slide 20')
          })
          it('should not navigate to the previous slide group when clicking the prev arrow at the first slide group', async () => {
            const wrapper = mount(VSlickCarousel, {
              slots: {
                default: basicSlides(20)
              },
              props: {
                arrows: true,
                initialGroupIndex: 0,
                infinite: false
              }
            })
            expect(
              wrapper.find('.v-slick-slide-group.current').text()
            ).toContain('basic slide 1')
            await wrapper.find('.v-slick-arrow.prev').trigger('click')
            expect(
              wrapper.find('.v-slick-slide-group.current').text()
            ).toContain('basic slide 1')
          })
        })
        describe('Infinite mode', () => {
          it('should navigate to the first slide group when clicking the next arrow at the last slide group', async () => {
            const wrapper = mount(VSlickCarousel, {
              slots: {
                default: basicSlides(20)
              },
              props: {
                arrows: true,
                initialGroupIndex: 19,
                infinite: true
              }
            })
            expect(
              wrapper.find('.v-slick-slide-group.current').text()
            ).toContain('basic slide 20')
            await wrapper.find('.v-slick-arrow.next').trigger('click')
            expect(
              wrapper.find('.v-slick-slide-group.current').text()
            ).toContain('basic slide 1')
          })
          it('should navigate to the last slide group when clicking the prev arrow at the first slide group', async () => {
            const wrapper = mount(VSlickCarousel, {
              slots: {
                default: basicSlides(20)
              },
              props: {
                arrows: true,
                initialGroupIndex: 0,
                infinite: true
              }
            })
            expect(
              wrapper.find('.v-slick-slide-group.current').text()
            ).toContain('basic slide 1')
            await wrapper.find('.v-slick-arrow.prev').trigger('click')
            expect(
              wrapper.find('.v-slick-slide-group.current').text()
            ).toContain('basic slide 20')
          })
        })
      })
    })
    describe('Dot navigation', () => {
      it('should navigate to the corresponding slide group when clicking a dot', async () => {
        const wrapper = mount(VSlickCarousel, {
          slots: {
            default: basicSlides(20)
          },
          props: {
            dots: true,
            useCSSTransitions: false
          }
        })
        expect(wrapper.find('.v-slick-slide-group.current').text()).toContain(
          'basic slide 1'
        )
        await wrapper.findAll('.v-slick-dots > *').at(1).trigger('click')
        expect(wrapper.find('.v-slick-slide-group.current').text()).toContain(
          'basic slide 2'
        )
        await wrapper.findAll('.v-slick-dots > *').at(5).trigger('click')
        expect(wrapper.find('.v-slick-slide-group.current').text()).toContain(
          'basic slide 6'
        )
      })
    })
  })
})
