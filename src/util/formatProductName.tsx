
export function formatProductName(name: string): string {

  name = name.replaceAll(/\d+\s*,\s*\d+\s*g/g, '').trim()
  name = name.replaceAll(/\d+\s*x\s*\d+\s*g/g, '').trim()
  name = name.replaceAll(/\d+\s*g/g, '').trim()
  name = name.replaceAll(/\d+,\d+g/g, '').trim()
  name = name.replaceAll(/\d+\/\d+/g, '').trim()
  name = name.replaceAll(/\d+\s*Kg/ig, '').trim()
  name = name.replaceAll(/\d+\s*oz/ig, '').trim()
  name = name.replaceAll(/oz\s+/ig, '').trim()

  name = name.replaceAll(/\(trojsk[áé] unce\)/ig, '').trim()
  name = name.replaceAll(/\(trojských uncí\)/ig, '').trim()
  name = name.replaceAll(/investiční/ig, '').trim()

  name = name.replaceAll(/zlat[ýá]/ig, '').trim()
  name = name.replaceAll(/stříbrn[ýá]/ig, '').trim()
  name = name.replaceAll(/platinov[ýá]/ig, '').trim()
  name = name.replaceAll(/palladiov[ýá]/ig, '').trim()
  name = name.replaceAll(/platinmünze/ig, '').trim()
  name = name.replaceAll(/platinbarren/ig, '').trim()

  name = name.replaceAll(/slitek/ig, '').trim()
  name = name.replaceAll(/mince/ig, '').trim()
  name = name.replaceAll(/cihla/ig, '').trim()

  return name;
}