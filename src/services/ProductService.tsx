import {Product} from "../types/Product";
import {api} from "./api";


export const getProductsAsDTO = (metal: string|undefined) => {
    if(metal === undefined || metal === 'all') {
        return api.get("product/dto");
    }
    return api.get("product/dto/metal/"+metal);
}

export const getProductById = async (productId: number): Promise<Product> => {
    const { data } = await api.get<Product>('product/dto/id/' + productId);
    return data;
};

