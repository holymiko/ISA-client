import {Product} from "../types/Product";
import {api} from "./api";


export const scrapByMetal = (metal: string) => {
    return api.get("scrap/metal/" + metal);
}
export const getAllProductsAsDTO = () => {
    return api.get("product/dto");
}
export const getGoldProductsAsDTO = () => {
    return api.get("product/dto/metal/gold");
}
export const getSilverProductsAsDTO = () => {
    return api.get("product/dto/metal/silver");
}
export const getPlatinumProductsAsDTO = () => {
    return api.get("product/dto/metal/platinum");
}
export const getPalladiumProductsAsDTO = () => {
    return api.get("product/dto/metal/palladium");
}

export const getProducts = async (): Promise<Product[]> => {
    const { data } = await api.get<Product[]>('product/dto');
    return data;
};

export const getProductById = async (productId: number): Promise<Product> => {
    const { data } = await api.get<Product>('product/dto/id/' + productId);
    return data;
};

