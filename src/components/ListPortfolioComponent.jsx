import React, { Component } from 'react';
import PortfolioService from '../services/PortfolioService';
import { sort } from '../services/tablesort';
import { getTextYield } from '../services/utils.js';


class ListPortfolioComponent extends Component {

    constructor(props) {
        super(props)

        this.state = {
            portfolios: []
        }
    }

    componentDidMount(){
        PortfolioService.getPortfolios().then((res) => {
            this.setState({portfolios: res.data});
        });
    }

    componentDidUpdate(){
        sort();
    }

    render() {
        return (
            <div>
                <h2 className="text-center">Portfolio List</h2>
                <div className="row">
                    <table className="table table-striped table-bordered table-sortable">
                        <thead>      
                            <tr>
                                <th>Owner</th>
                                <th>Buy Price</th>
                                <th>Value</th>
                                <th>Yield</th>
                                <th>n. Investments</th>
                                <th>Action</th>
                            </tr>
                        </thead>
    
                        <tbody>
                            {
                                this.state.portfolios.map(
                                    portfolio =>
                                    <tr key = {portfolio.id}>
                                            <td><a href={"http://localhost:3000/portfolio/"+portfolio.id}>{portfolio.owner}</a></td>
                                            <td align="right">{Math.round(portfolio.beginPrice)}</td>
                                            <td align="right">{Math.round(portfolio.value)}</td>
                                            <td align="center">{getTextYield(portfolio.yield)}</td>
                                            <td align="center">{portfolio.investmentIds.length}</td>
                                            <td align="center"><button className="button-row" onClick = { ()=> PortfolioService.updatePortfolioPrices(portfolio.id)}>Update</button> </td>
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

export default ListPortfolioComponent;