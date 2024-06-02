// @ts-nocheck
import {Dealer} from "../types/enums/dealer";
import logoAurum from "../img/logo/aurumpro1.png"
import logoCeskaMincovna from "../img/logo/cm2.png"
import logoBessergold from "../img/logo/bessergold1.png"
import logoBessegoldDe from "../img/logo/bessergoldDe5.png"
import logoGoldASilver from "../img/logo/goldasilver1.png"
import logoSilverum from "../img/logo/silverum1.png"
import logoZlataky from "../img/logo/zlataky5.png"
import {Form} from "../types/enums/form";
import {Metal} from "../types/enums/metal";
import iconBar from "../img/icon/gold/iconBar.jpg";
import iconCoin from "../img/icon/gold/iconCoin.jpg";
import iconWheel from "../img/icon/gold/iconWheel.jpg";
import iconBarSilver from "../img/icon/silver/iconBar.jpg";
import iconCoinSilver from "../img/icon/silver/iconCoin.jpg";
import iconWheelSilver from "../img/icon/silver/iconWheel.jpg";

export const getDealerImage = (dealer: Dealer | undefined) => {
  switch (dealer) {
    case Dealer.AURUM_PRO: return logoAurum;
    case Dealer.BESSERGOLD_CZ: return logoBessergold;
    case Dealer.BESSERGOLD_DE: return logoBessegoldDe;
    case Dealer.CESKA_MINCOVNA: return logoCeskaMincovna;
    case Dealer.GOLD_A_SILVER: return logoGoldASilver;
    case Dealer.SILVERUM: return logoSilverum;
    case Dealer.ZLATAKY: return logoZlataky;
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
