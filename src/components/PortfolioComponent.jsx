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
            investments: []
        }
    }

    componentDidMount(){
        PortfolioService.getPortfolioById(this.state.id).then((res) => {
            let portfolio = res.data;
            this.setState({ 
                owner: portfolio.owner,
                beginPrice: portfolio.beginPrice,
                value: portfolio.value,
                yield: portfolio.yield,
                investments: portfolio.investments
            });
        });
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
                                <th>Buy Date</th>
                                <th>Actual Price</th>
                                <th>Redemption</th>
                                <th>Buy Price</th>
                                <th>Yield</th>
                            </tr>
                        </thead>
    
                        <tbody>
                            {
                                this.state.investments.map(
                                    investment =>
                                    <tr key = {investment.id}>
                                            <td><a href={"http://localhost:3000/product/"+investment.product.id}>
                                                {investment.product.name}</a></td>
                                            <td>{investment.beginDate.replaceAll("-","_")}</td>
                                            <td>{priceWithSpaces(investment.product.latestPrice.price)}</td>
                                            <td>{priceWithSpaces(investment.product.latestPrice.redemption)}</td>
                                            <td>{priceWithSpaces(investment.beginPrice)}</td>
                                            <td>{getTextYield( investment.yield )}</td>
                                    </tr>
                                )
                            }
                            <td></td>
                            <td></td>
                            <td><b>{Math.round(this.state.beginPrice)}</b></td>
                            <td><b>{Math.round(this.state.value)}</b></td>
                            <td></td>
                            <td><b>{getTextYield(this.state.yield)}</b></td>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default PortfolioComponent;