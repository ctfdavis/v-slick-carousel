export * from './carousel-utils'
export * from './match-media'

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

export function clearSelection() {
  if (!window.getSelection) return
  if (window.getSelection()?.empty) {
    window.getSelection()!.empty()
  } else if (window.getSelection()?.removeAllRanges) {
    window.getSelection()!.removeAllRanges()
  }
}

export function json2mq(obj: Record<string, any>) {
  const conditions = Object.keys(obj).map((key) => {
    let value = obj[key]
    if (Array.isArray(value)) {
      value = value.join(' and ')
    }
    return `(${key}: ${value})`
  })
  return conditions.join(' and ')
}

export function debounce(
  callback: () => Promise<void>,
  wait: number
): { cancel: () => void } {
  const timeoutId = setTimeout(callback, wait)
  return { cancel: () => clearTimeout(timeoutId) }
}
