export * from './carousel-utils'

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
