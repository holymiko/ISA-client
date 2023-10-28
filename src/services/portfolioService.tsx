import {api} from "./api";

export const getPortfolios = () => {
    return api.get( 'portfolio/dto/1');
}
// export const getPortfolioById = (id: number) => {
//     return api.get( 'portfolio/dto/4/id/' + id);
// }

// TODO Add type
export const createPortfolio = (portfolioCreateDto: any) => {
    return api.post( 'portfolio/', portfolioCreateDto);
}
