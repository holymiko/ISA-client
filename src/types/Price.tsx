import {Dealer} from "./enums/dealer";

export interface Price {
  id: number,
  price: number,
  redemption: number,
  priceDateTime: Date;
  redemptionDateTime: Date;
  dealer: Dealer,
  spread: number,
  pricePerGram: number,
}