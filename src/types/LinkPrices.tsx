import {Dealer} from "./enums/dealer";
import {Price} from "./Price";

export interface LinkPrices {
  id: number,
  dealer: Dealer,
  uri: string,
  prices: Price[],
}