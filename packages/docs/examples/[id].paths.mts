import examples from '../src/examples'

export default {
  paths() {
    return [
      ...Object.entries(examples).map(([id, val]) => ({
        params: { id, title: val.name }
      }))
    ]
  }
}
