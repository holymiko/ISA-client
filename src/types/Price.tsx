import {Dealer} from "./dealer";

export interface Price {
  dateTime: string,
  price: number,
  redemption: number,
  dealer: Dealer,
  spread: number,
  pricePerGram: number,
}