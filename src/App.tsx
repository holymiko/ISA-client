import './App.css';
import React from "react";
import {Route, Routes, Navigate} from 'react-router-dom';
import {HeaderComponent} from "./components/HeaderComponent";
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
                <Routes>
                    <Route index element={<HomePage/>} />
                    <Route path="portfolio">
                        <Route path="all" element={<PortfolioListPage/>}/>
                        <Route path="add" element={<PortfolioCreatePage/>}/>
                        <Route path="id" element={<PortfolioPage/>}/>
                    </Route>
                    <Route path = "product">
                        <Route index element={<ProductListPage/>}/>
                        <Route path="id/:id" element={<ProductPage/>} />
                        <Route path=":metal" element={<ProductListPage/>}/>
                    </Route>
                    <Route path="404" element={<NotFound />} />
                    <Route path="*" element={<Navigate to="404" />} />
                </Routes>
            </Box>
        </div>
    );
}

export default App;
