import {Price} from "../types/Price";

export function compareStringAsNumber(a: string, b: string ) {
  a = a.replaceAll('%','').trim();
  b = b.replaceAll('%', '').trim();
  a = a.replaceAll('Kč','').trim();
  b = b.replaceAll('Kč', '').trim();
  a = a.replaceAll(' ','').trim();
  b = b.replaceAll(' ', '').trim();

  return compareByPrice2(parseInt(a), parseInt(b))
}

/**
 * ASC Highest selling price. Zero placed on button.
 * @param a
 * @param b
 */
export function compareByPrice(a: Price, b: Price ) {
  return compareByPrice2(a.price, b.price)
}

export function compareByPrice2(a: number, b: number ) {
  if (a === 0) return 1;
  if (b === 0) return -1;
  return a < b
    ? -1
    : a > b ? 1 : 0;
}

/**
 * DCS Highest Redemption. Zero placed on button
 * @param a
 * @param b
 */
export function compareByRedemption(a: Price, b: Price ): number {
  return a.redemption > b.redemption
            ? -1 :
            a.redemption < b.redemption ? 1 : 0
}