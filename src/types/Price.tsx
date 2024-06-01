import {Dealer} from "./enums/dealer";
import {Availability} from "./enums/availability";

export interface Price {
  id: number,
  price: number,
  redemption: number,
  priceDateTime: Date;
  redemptionDateTime: Date;
  dealer: Dealer,
  spread: number,
  pricePerGram: number,
  availability: Availability,
  availabilityMessage: string,
}