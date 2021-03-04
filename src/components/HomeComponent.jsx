import React, { Component } from 'react';

class HomeComponent extends Component {
    render() {
        return (
            <div className="home-div">
                <h1 className="home-h1">
                    <a href={"http://localhost:3000/products/"}>Products</a>
                </h1>
                
                <h1 className="home-h1">
                    <a href={"http://localhost:3000/portfolios/"}>Portfolios</a>
                </h1>
            </div>
        );
    }
}

export default HomeComponent;