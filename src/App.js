import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Route, Switch}from 'react-router-dom';
import PortfolioListComponent from './components/PortfolioListComponent';
import HeaderComponent from './components/HeaderComponent';
import FooterComponent from './components/FooterComponent';
import PortfolioComponent from './components/PortfolioComponent';
import ProductComponent from './components/ProductComponent';
import ProductListComponent from './components/ProductListComponent';
import HomeComponent from './components/HomeComponent';
import PortfolioCreateComponent from './components/PortfolioCreateComponent';

function App() {
  return (
    <div>
        <Router>
            <HeaderComponent />
            <div className="container">
                <Switch>
                    <Route path = "/" exact component={HomeComponent}></Route>

                    <Route path = "/portfolio/:id" component={PortfolioComponent}></Route>
                    <Route path = "/portfolios" component={PortfolioListComponent}></Route>
                    <Route path = "/add-portfolio" component={PortfolioCreateComponent}></Route>
                  
                    <Route path = "/product/:id" component={ProductComponent}></Route>
                    <Route path = "/products" component={ProductListComponent}></Route>
                    <Route path = "/products/:metal" component={ProductListComponent}></Route>
                </Switch>
            </div>
            {/* <FooterComponent /> */}
        </Router>
    </div>

  );
}

export default App;
