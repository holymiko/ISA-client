import React, { Component } from 'react';
import PortfolioService from '../services/PortfolioService';
import ProductService from '../services/ProductService';

class PortfolioCreateComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            owner: '',
            investmentIds: [],
            products: []

        }
        this.changeOwnerHandler.bind(this);
        this.changeIdsHandler.bind(this);
        this.savePortfolio.bind(this);
    }

    savePortfolio = (e) => {
        e.preventDefault();
        console.log("Save employ");
        console.log( JSON.stringify( this.state.investmentIds ));
        PortfolioService.createPortfolio({owner: this.state.owner, investmentIds: this.state.investmentIds}).then(res => {
            this.props.history.push('/portfolios');
        });
    }

    cancel() {
        this.props.history.push("/portfolios");
    }

    changeIdsHandler = (event) => {
        console.log(JSON.stringify(event.target.value));
        // this.setState({investmentIds: event.target.value});
        this.setState(previousState => ({
            investmentIds: [...previousState.investmentIds, event.target.value]
        }));
    }

    changeOwnerHandler = (event) => {
        this.setState({owner: event.target.value});
    }

    componentDidMount() {
        ProductService.getAllProductsAsDTO().then((res) => {
            this.setState({products: res.data});
        });
    }

    render() {
        return (
            <div>
                <div className="container">
                    <div className="row">
                        <div className="card col-md-6 offset-md-3 offset-md-3">
                            <h3 className="text-center">Add Portfolio</h3>
                            <div className="card-body">
                                <form>
                                    <div className="form-group">
                                        <label>Owner: </label>
                                        <input placeholder="Owner" name="owner" className="form-control"
                                                value={this.state.owner} onChange={this.changeOwnerHandler}/>
                                    </div>
                                    
                                    <select multiple={true} value={this.state.investmentIds} onChange={this.changeIdsHandler}>
                                    {
                                    this.state.products.map( (product) =>
                                        <option value={product.id}>{product.name}</option>)
                                    }
                                    </select>

                                    <button className="btn btn-success" onClick={this.savePortfolio}>Save</button>
                                    <button className="btn btn-danger" onClick={this.cancel.bind(this)} style={{marginLeft: "10px"}}>Cancel</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default PortfolioCreateComponent;