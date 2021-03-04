import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Route, Switch}from 'react-router-dom';
import ListPortfolioComponent from './components/ListPortfolioComponent';
import HeaderComponent from './components/HeaderComponent';
import FooterComponent from './components/FooterComponent';
import PortfolioComponent from './components/PortfolioComponent';
import ProductComponent from './components/ProductComponent';
import ListProductComponent from './components/ListProductComponent';
import HomeComponent from './components/HomeComponent';

function App() {
  return (
    <div>
        <Router>
            <HeaderComponent />
            <div className="container">
                <Switch>
                    <Route path = "/" exact component={HomeComponent}></Route>

                    <Route path = "/portfolios" component={ListPortfolioComponent}></Route>
                    <Route path = "/portfolio/:id" component={PortfolioComponent}></Route>

                    <Route path = "/products" component={ListProductComponent}></Route>
                    <Route path = "/products/:metal" component={ListProductComponent}></Route>
                    <Route path = "/product/:id" component={ProductComponent}></Route>
                </Switch>
            </div>
            {/* <FooterComponent /> */}
        </Router>
    </div>

  );
}

export default App;
