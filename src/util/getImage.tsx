import {Dealer} from "../types/dealer";
import logo from "../img/logo/bessergold1.png"
import logoZlataky from "../img/logo/zlataky4.png"
import logoSilverum from "../img/logo/silverum1.png"
import logoBessegoldDe from "../img/logo/bessergoldDe5.png"

export const getImage = (dealer: Dealer) => {
  switch (dealer) {
    case Dealer.BESSERGOLD_CZ: return logo;
    case Dealer.Zlataky: return logoZlataky;
    case Dealer.Silverum: return logoSilverum;
    case Dealer.BESSERGOLD_DE: return logoBessegoldDe;
    default: return "";
  }
}
