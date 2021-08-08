import axios from 'axios';

const BASE = "http://localhost:8080/api/v2/";
const SCRAP_URL = "scrap/";
const PORTFOLIO_URL = "portfolio/";

class PortfolioService {
    getPortfolios(){
        return axios.get(BASE + PORTFOLIO_URL + "dto/1");
    }
    getPortfolioById(id){
        return axios.get(BASE + PORTFOLIO_URL + "dto/4/id/"+id);
    }

    createPortfolio(portfolioCreateDto){
        return axios.post(BASE + PORTFOLIO_URL, portfolioCreateDto);
    }

    scrapByPortfolio(portfolioId){
        return axios.get(BASE + SCRAP_URL + PORTFOLIO_URL + portfolioId);
    }
}

export default new PortfolioService()