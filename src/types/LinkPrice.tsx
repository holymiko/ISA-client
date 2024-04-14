import {Dealer} from "./enums/dealer";
import {Price} from "./Price";

export interface LinkPrice {
  id: number,
  dealer: Dealer,
  uri: string,
  price: Price,
}