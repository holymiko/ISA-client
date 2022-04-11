
export const HeaderComponent = () => {
    return (
        <div>
            <header>
                <nav className="navbar navbar-expand-md navbar-dark bg-dark">
                    <div className="navbar-brand">
                        <h3><a className="App-header-button" href={'http://localhost:3000/'} >Precious metals</a></h3>
                    </div>
                    <div className="navbar-brand">
                        <a className="App-header-button" href={"http://localhost:3000/portfolio/"} >Portfolios</a>
                    </div>
                    <div className="navbar-brand">
                        <a className="App-header-button" href={'http://localhost:3000/product/gold'} >Gold</a>
                    </div>
                    <div className="navbar-brand">
                        <a className="App-header-button" href={'http://localhost:3000/product/silver'} >Silver</a>
                    </div>
                    <div className="navbar-brand">
                        <a className="App-header-button" href={'http://localhost:3000/product/platinum'} >Platinum</a>
                    </div>
                    <div className="navbar-brand">
                        <a className="App-header-button" href={'http://localhost:3000/product/palladium'} >Palladium</a>
                    </div>
                </nav>
            </header>
        </div>
    );
}
