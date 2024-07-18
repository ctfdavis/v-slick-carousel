const OBJ_STRING_ID = '__obj_string__'

export function codify(obj: any) {
  let jsonString = JSON.stringify(obj, null, 2)

  // Add newlines after commas and curly braces
  jsonString = jsonString
    .replace(/,(\s*?)(?=\S)/g, ',\n$1')
    .replace(/\{(\s*?)(?=\S)/g, '{\n$1')
    .replace(/(\s*?)\}(?=\s*?$)/g, '$1\n}')

  jsonString = jsonString.replace(
    new RegExp(String.raw`"${OBJ_STRING_ID}([\d\w]+)"`),
    '$1'
  )

  jsonString = jsonString.replace(/\n{3,}/g, '\n\n')
  jsonString = jsonString.replace(/\n{2,}/g, '\n')

  return jsonString
}

export function markAsObj(str: string) {
  return `${OBJ_STRING_ID}${str}`
}
