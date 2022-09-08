import {BoxColumn} from "../components/BoxColumn";
import {Link} from "react-router-dom";
import {PageTitle} from "../components/PageTitle";

export const HomePage = () => {
    return (
        <BoxColumn sx={{ height: '31rem', pt: '3rem'}}>
            <PageTitle>
                <Link to={"/product/all"}>Products</Link>
            </PageTitle>

            <PageTitle>
                <Link to={"/portfolio"}>Portfolios</Link>
            </PageTitle>
        </BoxColumn>
    );
}
