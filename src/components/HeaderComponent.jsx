import React, { Component } from 'react';

class HeaderComponent extends Component {

    constructor(props) {
        super(props)

        this.state = {
        }
    }

    render() {
        return (
            <div>
                <header>
                    <nav className="navbar navbar-expand-md navbar-dark bg-dark">
                        <div className="navbar-brand">
                            <h3><a className="App-header-button" href={'http://localhost:3000/'} >Precious metals</a></h3>
                        </div>
                        <div className="navbar-brand">
                            <a className="App-header-button" href={"http://localhost:3000/portfolios/"} >Portfolios</a>
                        </div>
                        <div className="navbar-brand">
                            <a className="App-header-button" href={'http://localhost:3000/products/gold'} >Gold</a>
                        </div>
                        <div className="navbar-brand">
                            <a className="App-header-button" href={'http://localhost:3000/products/silver'} >Silver</a>
                        </div>
                        <div className="navbar-brand">
                            <a className="App-header-button" href={'http://localhost:3000/products/platinum'} >Platinum</a>
                        </div>
                        <div className="navbar-brand">
                            <a className="App-header-button" href={'http://localhost:3000/products/palladium'} >Palladium</a>
                        </div>
                    </nav>
                </header>
            </div>
        );
    }
}

export default HeaderComponent;