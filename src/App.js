import './App.css';
import React from "react";
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {HeaderComponent} from "./components/HeaderComponent.tsx";
import PortfolioPage from "./pages/PortfolioPage";
import PortfolioListPage from "./pages/PortfolioListPage";
import PortfolioCreatePage from "./pages/PortfolioCreatePage";
import ProductPage from "./pages/ProductPage";
import Box from "@mui/material/Box";
import {NotFound} from "./components/NotFound";
import {HomePage} from "./pages/HomePage";
import {ProductListPage} from "./pages/ProductList/ProductListPage";

function App() {
    return (
        <div>
            <HeaderComponent />
            <Box sx={{width: '100%', px: '4rem', pb: '3rem', height: '1'}}>
                <Router>
                    <Switch>
                        <Route exact path = "/" component={HomePage}/>
                        <Route exact path = "/portfolio" component={PortfolioListPage}/>
                        <Route path = "/portfolio/add/" component={PortfolioCreatePage}/>
                        <Route path = "/portfolio/:id" component={PortfolioPage}/>
                        <Route path = "/product/id/:id" component={ProductPage} />
                        <Route path = "/product" component={ProductListPage}/>
                        <Route path = "/product/:metal" component={ProductListPage}/>
                        <Route component={NotFound}/>
                    </Switch>
                </Router>
            </Box>
        </div>
    );
}

export default App;
