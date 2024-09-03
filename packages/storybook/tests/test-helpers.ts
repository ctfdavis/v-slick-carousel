export const scopeId = 'tests'

export function examplePath(id: string): string {
  return `/iframe.html?id=${scopeId}-${id.split('-').join('')}--${id}`
}
