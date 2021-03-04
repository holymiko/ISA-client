import axios from 'axios';

const PORTFOLIO_API_BASE_URL = "http://localhost:8080/api/v1/portfolio/";
const SCRAP_API_BASE_URL = "http://localhost:8080/api/v1/scrap/";

class PortfolioService {
    getPortfolios(){
        return axios.get(PORTFOLIO_API_BASE_URL+"dto");
    }
    getPortfolioById(id){
        return axios.get(PORTFOLIO_API_BASE_URL+"dto/portfolio-investments/id/"+id);
    }
    updatePortfolioPrices(id){
        return axios.get(SCRAP_API_BASE_URL+'portfolio/'+id);
    }
}

export default new PortfolioService()