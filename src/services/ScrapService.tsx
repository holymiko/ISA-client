import {api} from "./api";

export const scrapByMetalInSync = (
  metal: string|undefined
) => {
    return api.post("scrap/param", {
        params: {
            'metal': metal?.toUpperCase()
        },
    });
}

export const scrapProductById = (productId: number) => {
    return api.post("scrap/product/" + productId);
}


