import {api} from "./api";
import {Form} from "../types/form";
import {Dealer} from "../types/dealer";

export const scrapByParams = (
  isRedemption: boolean|undefined,
  dealer: Dealer|undefined,
  metal: string|undefined,
  form: Form|undefined
) => {
    return api.get("scrap/param", {
        params: {
            'isRedemption': isRedemption,
            'metal': metal?.toUpperCase(),
            'dealer': dealer?.toUpperCase(),
            'form': form?.toUpperCase()
        },
    });
}

export const scrapProductById = (productId: number) => {
    return api.get("scrap/product/" + productId);
}


