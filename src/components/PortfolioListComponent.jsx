import React, { Component } from 'react';
import PortfolioService from '../services/PortfolioService';
import { sort } from '../services/tablesort';
import { getTextYield } from '../services/utils.js';

class PortfolioListComponent extends Component {

    constructor(props) {
        super(props)

        this.state = {
            portfolios: []
        }
        this.addPortfolio = this.addPortfolio.bind(this);
    }

    addPortfolio(){
        this.props.history.push("/add-portfolio");
    }

    componentDidMount(){
        PortfolioService.getPortfolios().then(
            (res) => {
                this.setState({portfolios: res.data});
            }
        );
    }

    componentDidUpdate(){
        sort();
    }

    eventListener(portfolio){
        PortfolioService.scrapByPortfolio(portfolio.id).then(()=>{
            this.componentDidMount()
            this.render()
        })
    }

    makeTableRow(portfolio){
        return (
                <tr className="tableRow" key = {portfolio.id} >
                    <td><a href={"http://localhost:3000/portfolio/"+portfolio.id}>{portfolio.owner}</a></td>
                    <td align="right">{Math.round(portfolio.beginPrice)}</td>
                    <td align="right">{Math.round(portfolio.value)}</td>
                    <td align="center">{getTextYield(portfolio.yield)}</td>
                    <td align="center">{portfolio.investmentIds.length}</td>
                    <td align="center"><button id="update" className="button-row" onClick = { ()=>{this.eventListener(portfolio)} }>Update</button> </td>
                </tr>
        )
    }

    render() {
        return (
            <div>
                <h2 className="text-center">Portfolio List</h2>
                <div className="row">
                    <button className="btn btn-primary" onClick={this.addPortfolio}>+</button>
                </div>
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
                                    (portfolio) => {
                                        return(this.makeTableRow(portfolio))
                                    }
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default PortfolioListComponent;
