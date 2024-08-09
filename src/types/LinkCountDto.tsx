import {Dealer} from "./enums/dealer";

export interface LinkCountDto {
  dealer: Dealer,
  productCount: number,
  linkWithoutProductCount: number,
  hiddenProductCount: number
}