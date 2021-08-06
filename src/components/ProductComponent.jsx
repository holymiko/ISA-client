import React, { Component } from 'react';
import ProductService from '../services/ProductService';
import { sort } from '../services/tablesort';

class ProductComponent extends Component {

    constructor(props) {
        super(props)

        this.state = {
            id: this.props.match.params.id,
            metal: '',
            name: '',
            grams: '',
            links: [],
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
                links: product.links,
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
                <div>Links: 
                    {this.state.links.map(
                        link => 
                            <div>
                                <a href={link}>
                                    {link}
                                </a>
                            </div>
                        )
                    }
                </div>
                
                <div className="row">
                    <table className="table table-striped table-bordered table-sortable">
                        <thead>
                            <tr>
                                <th>Date Time</th>
                                <th>Dealer</th>
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
                                            <td>{price.dealer}</td>
                                            <td>{price.price}</td>
                                            <td>{price.redemption}</td>
                                            <td>{price.spread}</td>
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