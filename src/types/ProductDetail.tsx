import {Metal} from "./enums/metal";
import {Form} from "./enums/form";
import {LinkPrices} from "./LinkPrices";
import {LinkPrice} from "./LinkPrice";

export interface ProductDetail {
  id: number,
  name?: string,
  metal: Metal,
  form: Form;
  grams: number,
  prices?: LinkPrices[],
  latestPrices: LinkPrice[],
}