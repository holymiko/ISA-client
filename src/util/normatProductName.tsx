
export function formatProductName(name: string): string {

  name = name.replaceAll(/^\d+ x \d+g/g, '').trim()
  name = name.replaceAll(/^\d+g/g, '').trim()
  name = name.replaceAll(/^\d+,\d+g/g, '').trim()
  name = name.replaceAll('(trojská unce)', '').trim()
  name = name.replaceAll(/investiční/ig, '').trim()

  return name;
}