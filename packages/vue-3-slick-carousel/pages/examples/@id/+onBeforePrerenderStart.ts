export { onBeforePrerenderStart }

import type { OnBeforePrerenderStartAsync } from 'vike/types'
import examples from '../../../src/examples'

const onBeforePrerenderStart: OnBeforePrerenderStartAsync =
  async (): ReturnType<OnBeforePrerenderStartAsync> => {
    return ['/examples', ...Object.keys(examples).map((o) => `/examples/${o}`)]
  }
