import React, { Component } from 'react';
import PortfolioService from '../services/PortfolioService';
import ProductService from '../services/ProductService';
import { sort } from '../services/tablesort';
import { getTextYield, numberWithSpaces } from '../services/utils.js';

class ProductComponent extends Component {

    constructor(props) {
        super(props)

        this.state = {
            id: this.props.match.params.id,
            metal: '',
            name: '',
            grams: '',
            link: '',
            latestPrice: '',
            prices: []
        }
    }

    componentDidMount(){
        ProductService.getProductById(this.state.id).then((res) => {
            let product = res.data;
            this.setState({ 
                metal: product.metal,
                name: product.name,
                grams: product.grams,
                link: product.link.link,
                latestPrice: product.latestPrice,
                prices: product.prices
            });
        });
    }

    componentDidUpdate(){
        sort();
    }

    render() {
        return (
            <div>
                <h2 className="text-center">Product</h2>
                <div>Id: {this.state.id}</div>
                <div>Product: {this.state.name}</div>
                <div>Metal: {this.state.metal}</div>
                <div>Grams: {this.state.grams}</div>
                <div>Link: <a href={this.state.link}>{this.state.link}</a></div>
                <div className="row">
                    <table className="table table-striped table-bordered table-sortable">
                        <thead>
                            <tr>
                                <th>Date Time</th>
                                <th>Price</th>
                                <th>Redemption</th>
                                <th>Split</th>
                                <th>Price/Gram</th>
                            </tr>
                        </thead>
    
                        <tbody>
                            {
                                this.state.prices.map(
                                    price =>
                                    <tr key = {price.id}>
                                            <td>{price.dateTime.replaceAll("-","_")}</td>
                                            <td>{price.price}</td>
                                            <td>{price.redemption}</td>
                                            <td>{price.split}</td>
                                            <td>{price.pricePerGram}</td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default ProductComponent;