import {Dealer} from "../types/dealer";
import logo from "../img/logo/bessergold1.png"
import logoZlataky from "../img/logo/zlataky4.png"
import logoSilverum from "../img/logo/silverum1.png"
import logoBessegoldDe from "../img/logo/bessergoldDe5.png"
import {Form} from "../types/form";
import {Metal} from "../types/metal";
import iconBar from "../img/icon/iconBar.jpg";
import iconCoin from "../img/icon/iconCoin.jpg";
import iconWheel from "../img/icon/iconWheel.jpg";
import iconBarSilver from "../img/icon/iconBarAg.jpg";
import iconCoinSilver from "../img/icon/iconCoinAg.jpg";
import iconWheelSilver from "../img/icon/iconWheelAg.jpg";

export const getDealerImage = (dealer: Dealer) => {
  switch (dealer) {
    case Dealer.BESSERGOLD_CZ: return logo;
    case Dealer.ZLATAKY: return logoZlataky;
    case Dealer.SILVERUM: return logoSilverum;
    case Dealer.BESSERGOLD_DE: return logoBessegoldDe;
    default: return "";
  }
}

export const getFormImage = (form: Form, metal: Metal) => {
  if(metal === Metal.GOLD) {
    switch (form) {
      case Form.BAR:
      case Form.KINEBAR: return iconBar;
      case Form.COIN: return iconCoin;
      default: return iconWheel;
    }
  }
  switch (form) {
    case Form.BAR:
    case Form.KINEBAR: return iconBarSilver;
    case Form.COIN: return iconCoinSilver;
    default: return iconWheelSilver;
  }

}
