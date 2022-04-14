import {BoxColumn} from "../components/BoxColumn";

export const HomePage = () => {
        return (
            <BoxColumn sx={{backgroundColor: 'chartreuse', height: '31rem', pt: '3rem'}}>
                <h1 className="home-h1">
                    <a href={"http://localhost:3000/product/"}>Products</a>
                </h1>
                
                <h1 className="home-h1">
                    <a href={"http://localhost:3000/portfolio/"}>Portfolios</a>
                </h1>
            </BoxColumn>
        );
}
