import {BoxColumn} from "../components/BoxColumn";
import {Link} from "react-router-dom";

export const HomePage = () => {
        return (
            <BoxColumn sx={{ height: '31rem', pt: '3rem'}}>
                <h1 className="home-h1">
                    <Link to={"/product"}>Products</Link>
                </h1>
                
                <h1 className="home-h1">
                    <Link to={"/portfolio"}>Portfolios</Link>
                </h1>
            </BoxColumn>
        );
}
