import {Price} from "./Price";

export interface Product {
  id: number;
  metal: string,
  name?: string,
  grams: number,
  form: string;
  links?: string[],
  latestPrices: Price[],
  bestPrice?: Price,
  bestRedemption?: Price,
  prices?: Price[],
}