import React, { Component } from 'react';
import ProductService from '../services/ProductService';
import { numberWithSpaces } from '../services/utils.js';
import { sortTableByColumn, sort } from '../services/tablesort.js';



class ProductListComponent extends Component {

    constructor(props) {
        super(props)

        this.state = {
            products: []
        }
    }

    componentDidMount(){
        console.log(window.location.pathname);

        switch (window.location.pathname) {
            case '/products':
            case '/products/':
                ProductService.getAllProductsAsDTO().then((res) => {
                    this.setState({products: res.data});
                });
                break;

            case '/products/gold':
            case '/products/gold/':

                ProductService.getGoldProductsAsDTO().then((res) => {
                    this.setState({products: res.data});
                });
                break;

            case '/products/silver':
            case '/products/silver/':
                ProductService.getSilverProductsAsDTO().then((res) => {
                    this.setState({products: res.data});
                });
                break;

            case '/products/platinum':
            case '/products/platinum/':
                ProductService.getPlatinumProductsAsDTO().then((res) => {
                    this.setState({products: res.data});
                });
                break;

            case '/products/palladium':
            case '/products/palladium/':
                ProductService.getPalladiumProductsAsDTO().then((res) => {
                    this.setState({products: res.data});
                });
                break;
        }
        
    }

    componentDidUpdate(){
        sort()
            // setTimeout(()=>{sortTableByColumn(document.getElementById("ProductsTable"),5)},500)
            // sortTableByColumn(document.querySelector("table"),1)
    }

    render() {
        return (
            <div>
                <h2 className="text-center">Product List</h2>
                <button className="button-top" onClick = { ()=> ProductService.scrapByMetal(this.state.products[0].metal)}>Update All</button>
                <div className="row">
                    <table id="ProductsTable" className="table table-striped table-bordered table-sortable">
                        <thead>      
                            <tr>
                                {/* <th>Id</th> */}
                                <th>Name</th>
                                {/* <th>Metal</th> */}
                                <th>Grams</th>
                                <th>Price</th>
                                <th>Redemption</th>
                                <th>Split</th>
                                <th>Price/Gram</th>
                            </tr>
                        </thead>
    
                        <tbody>
                            {
                                this.state.products.map(
                                    product =>
                                    <tr key = {product.id}>
                                        {/* <td>{product.id}</td> */}
                                        <td><a href={"http://localhost:3000/product/"+product.id}>{product.name}</a></td>
                                        {/* <td>{product.metal}</td> */}
                                        <td  align="center">{Math.round(product.grams*100)/100}</td>
                                        <td align="right" width="10%">
                                            {numberWithSpaces(Math.round(product.latestPrice.price))}
                                        </td>
                                        <td align="right">{numberWithSpaces(Math.round(product.latestPrice.redemption))}</td>
                                        <td>{Math.round(product.latestPrice.split*1_000_000)/1_000_000}</td>
                                        <td>{Math.round(product.latestPrice.pricePerGram*10_000)/10_000}</td>
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

export default ProductListComponent;
