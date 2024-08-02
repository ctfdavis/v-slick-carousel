import examples from '../src/examples'

export default {
  paths() {
    return [
      ...Object.keys(examples).map((id) => ({
        params: { id }
      }))
    ]
  }
}
