import {Product} from "../types/Product";
import {api} from "./api";
import {ProductDetail} from "../types/ProductDetail";
import {Metal} from "../types/enums/metal";

const PAGE_SIZE = 200;

export const getProductsByPages = async (metal: Metal|undefined, isTopProduct: boolean|undefined): Promise<any> => {
    let tmpProducts: Product[] = [];
    let b = true;
    let p = 0

    while (b) {
        await getProductsAsDTO(
            undefined,
            undefined,
            metal,
            undefined,
            undefined,
            undefined,
            undefined,
            false,
            isTopProduct,
            p,
            PAGE_SIZE
        ).then((page) => {
            tmpProducts = [...tmpProducts, ...page.content];
            if(page.last) {
                b = false;
            }
            p += 1;
        });
    }
    localStorage.setItem(metal !== undefined ? metal?.toLowerCase() : 'products', JSON.stringify(tmpProducts))
    return tmpProducts;
}


const getProductsAsDTO = async (
    dealer: string|undefined,
    producer: string|undefined,
    metal: string|undefined,
    form: string|undefined,
    grams: number|undefined,
    year: number|undefined,
    savedAlone: boolean|undefined,
    isHidden: boolean|undefined,
    isTopProduct: boolean|undefined,
    page: number|undefined,
    size: number|undefined
) => {
    if(metal === undefined || metal === 'all') {
        return api.get("product");
    }
    const { data } = await api.get("product", {
        params: {
            dealer: dealer !== undefined ? dealer.toUpperCase() : null,
            producer: producer !== undefined ? producer.toUpperCase() : null,
            metal: metal !== undefined ? metal.toUpperCase() : null,
            form: form !== undefined ? form.toUpperCase() : null,
            grams: grams !== undefined ? grams : null,
            year: year !== undefined ? year : null,
            savedAlone: savedAlone !== undefined ? savedAlone : null,
            isHidden: isHidden !== undefined ? isHidden : null,
            isTopProduct: isTopProduct !== undefined ? isTopProduct : null,
            page: page !== undefined ? page : null,
            size: size !== undefined ? size : null
        }
    });
    return data;
}

export const getProductById = async (productId: number): Promise<Product> => {
    const { data } = await api.get<Product>('product/' + productId);
    return data;
};

export const getProductDetailById = async (productId: number): Promise<ProductDetail> => {
    const { data } = await api.get<ProductDetail>('product/' + productId, {
        params: {
            dto: 1
        }
    });
    return data;
};

export const saveProductSeparately = async (productId: number, linkId: number): Promise<any> => {
    return await api.put<any, ProductDetail>('product/link', {
        fromProductId: productId,
        linkId: linkId,
        toProductId: null
    });
};

export const updateLinkReference = async (fromProductId: number, linkId: number, toProductId: number): Promise<ProductDetail> => {
    return await api.put<any, ProductDetail>('product/link', {
        fromProductId: fromProductId,
        linkId: linkId,
        toProductId: toProductId
    });
};

export const existsProductById = async (productId: number): Promise<boolean> => {
    const { data } = await api.get<boolean>('product/exists/' + productId);
    return data;
};

