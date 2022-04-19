import {Price} from "./Price";
import {Metal} from "./metal";
import {Form} from "./form";

export interface Product {
  id: number;
  metal: Metal,
  name?: string,
  grams: number,
  form: Form;
  links?: string[],
  latestPrices: Price[],
  bestPrice?: Price,
  bestRedemption?: Price,
  prices?: Price[],
}