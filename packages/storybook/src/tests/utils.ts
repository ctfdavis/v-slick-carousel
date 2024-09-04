import { waitFor } from '@storybook/test'

export const scopeId = 'tests'

export function testPath(storyId: string, testId = 'test'): string {
  return `/iframe.html?id=${scopeId}-${storyId}--${testId}`
}

export const wait = async (ms: number) => {
  await waitFor(() => new Promise((resolve) => setTimeout(resolve, ms)), {
    timeout: ms + 1
  })
}
