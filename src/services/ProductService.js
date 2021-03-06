import axios from 'axios';

const PRODUCT_API_BASE_URL = "http://localhost:8080/api/v2/product/";
const SCRAP_API_BASE_URL = "http://localhost:8080/api/v2/scrap/";

class ProductService {

    ////////// GET

    getAllProductsAsDTO(){
        return axios.get(PRODUCT_API_BASE_URL+"dto");
    }
    getGoldProductsAsDTO(){
        console.log("GoldProductsAsDTO");
        return axios.get(PRODUCT_API_BASE_URL+"dto/metal/gold");
    }
    getSilverProductsAsDTO(){
        return axios.get(PRODUCT_API_BASE_URL+"dto/metal/silver");
    }
    getPlatinumProductsAsDTO(){
        return axios.get(PRODUCT_API_BASE_URL+"dto/metal/platinum");
    }
    getPalladiumProductsAsDTO(){
        return axios.get(PRODUCT_API_BASE_URL+"dto/metal/palladium");
    }
    // getProductByIdAsDTO(id){
    //     return axios.get(PRODUCT_API_BASE_URL+"dto/id/"+id);
    // }


    getProductById(id){
        return axios.get(PRODUCT_API_BASE_URL+"id/"+id);
    }


    ////////// SCRAP

    scrapByMetal(metal){
        return axios.get(SCRAP_API_BASE_URL+"metal/"+metal);
    }
}

export default new ProductService()