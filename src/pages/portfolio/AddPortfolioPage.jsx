import React, { Component } from 'react';
import {createPortfolio} from '../../services/portfolioService';
import {PageTitle} from "../../components/PageTitle";
import {getProductsAsDTO} from "../../services/productService";

class AddPortfolioPage extends Component {
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
        createPortfolio({owner: this.state.owner, investmentIds: this.state.investmentIds}).then(res => {
            this.props.history.push('/portfolio');
        });
    }

    cancel() {
        this.props.history.push("/portfolio");
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
        getProductsAsDTO(
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined
        ).then((res) => {
            this.setState({products: res.data.content});
        });
    }

    render() {
        return (
            <div>
                <div className="container">
                    <div className="row">
                        <div className="card col-md-6 offset-md-3 offset-md-3">
                            <PageTitle>Add Portfolio</PageTitle>
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

export default AddPortfolioPage;