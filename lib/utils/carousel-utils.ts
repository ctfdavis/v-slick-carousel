import { VNode } from 'vue'
import { SlideNavigation } from '../types'

export const extractSlides = (
  vnodes: VNode[],
  isSlide = isSlidePredicate
): VNode[] => {
  return vnodes.flatMap((vnode) =>
    isSlide(vnode)
      ? [vnode]
      : Array.isArray(vnode.children) && vnode.children.length > 0
        ? extractSlides(vnode.children as VNode[])
        : []
  )
}

function isSlidePredicate(vnode: VNode): boolean {
  return !vnode.type.toString().startsWith('Symbol')
}

export const getNavigationOnKeyType = (
  e: KeyboardEvent,
  accessibility: boolean,
  rtl: boolean
) => {
  if (
    (e.target as HTMLElement)?.tagName.match('TEXTAREA|INPUT|SELECT') ||
    !accessibility
  )
    return ''
  if (e.key === 'Left')
    return rtl ? SlideNavigation.next : SlideNavigation.previous
  if (e.key === 'Right')
    return rtl ? SlideNavigation.previous : SlideNavigation.next
  return ''
}
