import {Link} from "react-router-dom";

export const HeaderComponent = () => {
    return (
        <div>
            <header>
                <nav className="navbar navbar-expand-md navbar-dark bg-dark">
                    <div className="navbar-brand">
                        <h3><Link className="App-header-button" to={'/'} >Precious metals</Link></h3>
                    </div>
                    <div className="navbar-brand">
                        <Link className="App-header-button" to={"/portfolio"}>Portfolios</Link>
                    </div>
                    <div className="navbar-brand">
                        <Link className="App-header-button" to={'/product/gold'}>Gold</Link>
                    </div>
                    <div className="navbar-brand">
                        <Link className="App-header-button" to={'/product/silver'}>Silver</Link>
                    </div>
                    <div className="navbar-brand">
                        <Link className="App-header-button" to={'/product/platinum'}>Platinum</Link>
                    </div>
                    <div className="navbar-brand">
                        <Link className="App-header-button" to={'/product/palladium'}>Palladium</Link>
                    </div>
                </nav>
            </header>
        </div>
    );
}
