import {Price} from "../types/Price";
import {compareAsc, parse} from "date-fns";

export function stringCleaner(a: string) {
  a = a.replaceAll('%','').trim();
  a = a.replaceAll('Kč','').trim();
  a = a.replaceAll(' ','').trim();
  return parseFloat(a);
}

export const compareStringAsDate = (a: string, b: string) => {
  return compareAsc(
      parse(a, 'h:mm:ss a, dd.MM.yyyy', 0),
      parse(b, 'h:mm:ss a, dd.MM.yyyy', 0)
  );
}

/**
 * ASC Lowest selling price. Zero placed on button.
 * @param a
 * @param b
 */
export function compareByPrice(a: Price, b: Price) {
  return compareByPrice2(a.price, b.price)
}

export function compareByPrice1(a: string, b: string) {
  return compareByPrice2(stringCleaner(a), stringCleaner(b))
}

/**
 * Used for comparing latest prices.
 * @param a
 * @param b
 */
export function compareByPrice2(a: number, b: number) {
  if (a === 0) return 1;
  if (b === 0) return -1;
  return a < b
    ? -1
    : a > b ? 1 : 0;
}

export function compareBySpread(x: string, y: string) {
  const a: number = stringCleaner(x);
  const b: number = stringCleaner(y);
  if (a === 0) return -1;
  if (b === 0) return 1;
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