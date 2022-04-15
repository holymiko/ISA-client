
export function formatProductName(name: string): string {

  name = name.replaceAll(/\d+\s*x\s*\d+\s*g/g, '').trim()
  name = name.replaceAll(/\d+\s*g/g, '').trim()
  name = name.replaceAll(/\d+,\d+g/g, '').trim()
  name = name.replaceAll(/\d+\s*Kg/ig, '').trim()

  name = name.replaceAll(/\(trojsk[áé] unce\)/ig, '').trim()
  name = name.replaceAll(/investiční/ig, '').trim()

  name = name.replaceAll(/zlat[ýá]/ig, '').trim()
  name = name.replaceAll(/stříbrn[ýá]/ig, '').trim()
  name = name.replaceAll(/slitek/ig, '').trim()
  name = name.replaceAll(/mince/ig, '').trim()
  name = name.replaceAll(/cihla/ig, '').trim()

  return name;
}