export function codify(obj: any) {
  let jsonString = JSON.stringify(obj, null, 2)

  jsonString = jsonString
    .replace(/,(\s*?)(?=\S)/g, ',\n$1')
    .replace(/\{(\s*?)(?=\S)/g, '{\n$1')
    .replace(/(\s*?)\}(?=\s*?$)/g, '$1\n}')

  jsonString = jsonString.replace(/\n{3,}/g, '\n\n')
  jsonString = jsonString.replace(/\n{2,}/g, '\n')

  return jsonString
}
