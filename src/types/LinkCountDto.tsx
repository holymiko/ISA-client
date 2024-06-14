import {Dealer} from "./enums/dealer";

export interface LinkCountDto {
  dealer: Dealer,
  linkCount: number,
  productCount: number,
}