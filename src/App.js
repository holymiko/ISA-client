import './App.css';
import {BrowserRouter as Router, Route, Switch}from 'react-router-dom';
import {HeaderComponent} from "./components/HeaderComponent.tsx";
import PortfolioPage from "./pages/PortfolioPage";
import PortfolioListPage from "./pages/PortfolioListPage";
import ProductListPage from "./pages/ProductListPage";
import PortfolioCreatePage from "./pages/PortfolioCreatePage";
import ProductPage from "./pages/ProductPage";
import HomePage from "./pages/HomePage";
import Box from "@mui/material/Box";

function App() {
    return (
        <>
            <HeaderComponent />
            <Box sx={{width: '1', px: '12rem', pb: '3rem'}}>
                <Router>
                    <Switch>
                        <Route path = "/" exact component={HomePage}/>

                        <Route path = "/portfolio/:id" component={PortfolioPage}/>
                        <Route path = "/portfolios" component={PortfolioListPage}/>
                        <Route path = "/add-portfolio" component={PortfolioCreatePage}/>

                        <Route path = "/product/:id" component={ProductPage}/>
                        <Route path = "/products" component={ProductListPage}/>
                        <Route path = "/products/:metal" component={ProductListPage}/>
                    </Switch>
                </Router>
            </Box>
          {/* <FooterComponent /> */}
        </>
    );
}

export default App;
