import {Price} from "./Price";

export interface Product {
  id: number;
  metal: string,
  name?: string,
  grams: number,
  form: string;
  links?: string[],
  latestPrices: Price[],
  prices?: Price[],
}