import {Dealer} from "./dealer";

export interface Price {
  dateTime: string,
  price: number,
  redemption: number,
  priceDateTime: Date;
  redemptionDateTime: Date;
  dealer: Dealer,
  spread: number,
  pricePerGram: number,
}