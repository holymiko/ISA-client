import axios from 'axios';

const BASE = "http://localhost:8080/";
const VERSION = "api/v1/"
const PORTFOLIO_URL = "portfolio/";
const SCRAP_URL = "scrap/";

class PortfolioService {
    getPortfolios(){
        return axios.get(BASE+VERSION+PORTFOLIO_URL+"dto");
    }
    getPortfolioById(id){
        return axios.get(BASE+VERSION+PORTFOLIO_URL+"dto/portfolio-investments/id/"+id);
    }

    createPortfolio(portfolioCreateDto){
        return axios.post(BASE+VERSION+PORTFOLIO_URL, portfolioCreateDto);
    }

    scrapByPortfolio(portfolioId){
        return axios.get(BASE+VERSION+SCRAP_URL+'portfolio/'+portfolioId);
    }
}

export default new PortfolioService()