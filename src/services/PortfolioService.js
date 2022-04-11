import {api} from "./api";

export const getPortfolios = () => {
    return api.get( 'portfolio/dto/1');
}
export const getPortfolioById = (id) => {
    return api.get( 'portfolio/dto/4/id/' + id);
}

export const createPortfolio = (portfolioCreateDto) => {
    return api.post( 'portfolio/', portfolioCreateDto);
}

export const scrapByPortfolio = (portfolioId) => {
    return api.get( 'scrap/portfolio/' + portfolioId);
}
