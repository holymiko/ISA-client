import {api} from "./api";

export const scrapByMetalInSync = (
    metal: string|undefined,
    isTopProduct: string|undefined
) => {
    return api.post("scrap/param", {}, {
        params: {
            metal: metal?.toUpperCase(),
            isTopProduct: isTopProduct !== undefined ? isTopProduct : null,
        },
    });
}

export const scrapAllLinksFromProductList = () => {
    return api.post("scrap/links");
}

export const scrapMissingProducts = () => {
    return api.post("scrap/products/missing");
}

export const scrapProductById = (productId: number) => {
    return api.post("scrap/product/" + productId);
}

export const scrapByPortfolio = (portfolioId: number) => {
    return api.get( 'scrap/portfolio/' + portfolioId);
}


