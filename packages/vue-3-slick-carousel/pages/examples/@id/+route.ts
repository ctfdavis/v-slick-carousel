import examples from '../../../src/examples'

const routeRegex = new RegExp(
  `/examples/(${Object.keys(examples).join('|')})`,
  'g'
)

// Route Function
export function route(pageContext) {
  if (pageContext.urlPathname === '/examples') {
    return { routeParams: { id: '' } }
  }
  const match = pageContext.urlPathname.match(routeRegex)
  if (!match) return false
  const [result] = match
  const [, id] = result.split('/examples/')
  console.debug('id', id)
  return { routeParams: { id } }
}
