import React from "react";
import {Route, Routes, Navigate} from 'react-router-dom';
import {PortfolioPage} from "./pages/portfolio/PortfolioPage";
import AddPortfolioPage from "./pages/portfolio/AddPortfolioPage";
import {ProductPage} from "./pages/ProductPage/ProductPage";
import Box from "@mui/material/Box";
import {NotFound} from "./components/NotFound";
import {HomePage} from "./pages/HomePage";
import {ProductListPage} from "./pages/ProductListPage/ProductListPage";
import {PortfolioListPage} from "./pages/portfolio/PortfolioListPage";
import {StockPage} from "./pages/StockPage";

export const RouterRoot = () => {
    return (
        <Box sx={{width: '100%', px: '4rem', pb: '3rem', pt: '6rem', height: '1'}}>
            <Routes>
                <Route index element={<HomePage/>} />
                <Route path="portfolio">
                    <Route index element={<PortfolioListPage/>}/>
                    <Route path="add" element={<AddPortfolioPage/>}/>
                    <Route path=":id" element={<PortfolioPage/>}/>
                </Route>
                <Route path = "product">
                    <Route index element={<ProductListPage/>}/>
                    <Route path="id/:id" element={<ProductPage/>} />
                    <Route path=":metal" element={<ProductListPage/>}/>
                </Route>
                <Route path = "stock">
                    <Route index element={<StockPage/>}/>
                </Route>
                <Route path="404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="404" />} />
            </Routes>
        </Box>
    );
}
