import {Price} from "../types/Price";

export function compareStringAsNumber(a: string, b: string ) {
  if ( parseInt(a) < parseInt(b) ){
    return -1;
  }
  if ( parseInt(a) > parseInt(b) ){
    return 1;
  }
  return 0;
}

/**
 * ASC Highest selling price. Zero placed on button.
 * @param a
 * @param b
 */
export function compareByPrice(a: Price, b: Price ) {
  if (a.redemption === 0) return 1;
  if (b.redemption === 0) return -1;
  return a.price < b.price
            ? -1
            : a.price > b.price ? 1 : 0;
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