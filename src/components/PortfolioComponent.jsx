import React, { Component } from 'react';
import PortfolioService from '../services/PortfolioService';
import { sort } from '../services/tablesort';
import { getTextYield, priceWithSpaces } from '../services/utils.js';

class PortfolioComponent extends Component {

    constructor(props) {
        super(props)

        this.state = {
            id: this.props.match.params.id,
            owner: '',
            beginPrice: '',
            value: '',
            yield: '',
            investmentsMetal: [],
            investmentsStock: []
        }
    }

    componentDidMount(){
        PortfolioService.getPortfolioById(this.state.id).then(
            (res) => {
                let portfolio = res.data;
                this.setState({ 
                    owner: portfolio.owner,
                    beginPrice: portfolio.beginPrice,
                    value: portfolio.value,
                    yield: portfolio.yield,
                    investmentsMetal: portfolio.investmentsMetal,
                    investmentsStock: portfolio.investmentsStock
                });
            }
        );
    }



    componentDidUpdate(){
        sort();
    }

    render() {
        return (
            <div>
                <h2 className="text-center">Portfolio</h2>
                <div>Id: {this.state.id}</div>
                <div>Owner: {this.state.owner}</div>
                <div className="row">
                    <table className="table table-striped table-bordered table-sortable">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Actual Price</th>
                                <th>Buy Dealer</th>
                                <th>Buy Date</th>
                                <th>Buy Price</th>
                                <th>Best Redemption</th>
                                <th>Best Redemption Dealer</th>
                                <th>Yield</th>
                            </tr>
                        </thead>
    
                        <tbody>
                            {
                                this.state.investmentsMetal.map(
                                    investment =>
                                    <tr key = {investment.id}>
                                        <td>
                                            <a href={"http://localhost:3000/product/"+investment.productDTO.id}>
                                                {investment.productDTO.name}
                                            </a>
                                        </td>
                                        <td>
                                            {investment.productDTO.latestPrices.map(
                                                price => 
                                                    <div>
                                                        {priceWithSpaces(price.price)}
                                                    </div>
                                                    )
                                            }
                                        </td>   
                                        <td>
                                            {investment.dealer}
                                        </td>
                                        <td>
                                            {investment.beginDate.replaceAll("-","_")}
                                        </td>
                                        <td>
                                            {priceWithSpaces(investment.beginPrice)}
                                        </td>
                                        <td>
                                            {priceWithSpaces(investment.productDTO.latestPrice.redemption)}
                                        </td>
                                        <td>
                                            {investment.productDTO.latestPrice.dealer}
                                        </td>
                                        <td>
                                            {getTextYield(investment.yield)}
                                        </td>
                                    </tr>
                                )
                            }
                            <td></td>
                            <td></td>
                            <td></td>
                            <td><b>{Math.round(this.state.beginPrice)}</b></td>
                            <td><b>{Math.round(this.state.value)}</b></td>
                            <td><b>{getTextYield(this.state.yield)}</b></td>
                        </tbody>
                    </table>
                </div>
                <div className="row">
                    <table className="table table-striped table-bordered table-sortable">
                        <thead>
                            <tr>
                                <th>Stock</th>
                                <th>Buy Date</th>
                                <th>Buy Price</th>
                                <th>Amount</th>
                                <th>Previous Close</th>
                                <th>Yield</th>
                            </tr>
                        </thead>
    
                        <tbody>
                            {
                                this.state.investmentsStock.map(
                                    investment =>
                                    <tr key = {investment.id}>
                                        <td>
                                            <a href={"http://localhost:3000/stock/"+investment.stockDTO.id}>
                                                {investment.stockDTO.name}
                                            </a>
                                        </td>
                                        <td>
                                            {investment.beginDate.replaceAll("-","_")}
                                        </td>
                                        <td>
                                            {investment.beginPrice}
                                        </td>
                                        <td>
                                            {investment.amount}
                                        </td>   
                                        <td>
                                            {investment.stockDTO.previousClose}
                                        </td>   
                                        <td>
                                            {getTextYield(investment.yield)}
                                        </td>
                                    </tr>
                                )
                            }
                            <td></td>
                            <td></td>
                            <td><b>{Math.round(this.state.beginPrice)}</b></td>
                            <td><b>{Math.round(this.state.value)}</b></td>
                            <td><b>{getTextYield(this.state.yield)}</b></td>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default PortfolioComponent;