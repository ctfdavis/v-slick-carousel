import { VNode } from 'vue'

export const canUseDOM = () =>
  !!(
    typeof window !== 'undefined' &&
    window.document &&
    window.document.createElement
  )

export const filterUndefined = <T extends object>(props: T) =>
  Object.keys(props)
    .filter((key) => props[key as keyof T] !== undefined)
    .reduce((acc, key) => {
      acc[key as keyof T] = props[key as keyof T]
      return acc
    }, {} as T)

export const mergeClass = (original: string | undefined, classes: string[]) => {
  return [original, ...classes].filter(Boolean).join(' ')
}

export const getVNodeStyle = (vnode: VNode) => {
  return {
    ...vnode.props?.style
  }
}
