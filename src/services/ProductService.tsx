import {Product} from "../types/Product";
import {api} from "./api";


export const getProductsAsDTO = (metal: string|undefined) => {
    if(metal === undefined || metal === 'all') {
        return api.get("product");
    }
    return api.get(
        "product",
        {
            params: {
                metal: metal.toUpperCase()
            }
        }
    );
}

export const getProductById = async (productId: number): Promise<Product> => {
    const { data } = await api.get<Product>('product/' + productId);
    return data;
};

