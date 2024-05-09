import React from "react";
import {Route, Routes, Navigate} from 'react-router-dom';
import {PortfolioPage} from "./pages/portfolio/PortfolioPage";
import AddPortfolioPage from "./pages/portfolio/AddPortfolioPage";
import {ProductPage} from "./pages/product/ProductPage";
import Box from "@mui/material/Box";
import {NotFoundPage} from "./pages/NotFoundPage";
import {HomePage} from "./pages/HomePage";
import {ProductListPage} from "./pages/product-list/ProductListPage";
import {PortfolioListPage} from "./pages/portfolio/PortfolioListPage";
import {StockPage} from "./pages/StockPage";
import {AddUser} from "./pages/user-add/AddUser";
import {UserListPage} from "./pages/user-list/UserListPage";
import {isEmpty, logOutMemClean} from "./util/utils";
import Login from "./pages/Login";
import {SidebarISA} from "./components/SidebarISA";


const ProtectedRoute = ({ children }: any) => {
    const token = sessionStorage.getItem('accessToken')
    if (isEmpty(token)) {
        logOutMemClean();
        return <Navigate to="/login" replace />
    }
    return (
        <SidebarISA>
            {children}
        </SidebarISA>
    );
};

export const RouterRoot = () => {
    return (
        <Box sx={{width: '100%', px: '4rem', pb: '3rem', pt: '6rem', height: '1'}}>
            <Routes>
                <Route index element={
                    <ProtectedRoute>
                        <HomePage/>
                    </ProtectedRoute>
                }/>
                <Route path="portfolio">
                    <Route index element={
                        <ProtectedRoute>
                            <PortfolioListPage/>
                        </ProtectedRoute>
                    }/>
                    <Route path="add" element={
                        <ProtectedRoute>
                            <AddPortfolioPage/>
                        </ProtectedRoute>
                    }/>
                    <Route path=":id" element={
                        <ProtectedRoute>
                            <PortfolioPage/>
                        </ProtectedRoute>
                    }/>
                </Route>
                <Route path = "product">
                    <Route index element={
                        <ProtectedRoute>
                            <ProductListPage/>
                        </ProtectedRoute>
                    }/>
                    <Route path="id/:id" element={
                        <ProtectedRoute>
                            <ProductPage/>
                        </ProtectedRoute>
                    } />
                    <Route path=":metal" element={
                        <ProtectedRoute>
                            <ProductListPage/>
                        </ProtectedRoute>
                    }/>
                </Route>
                <Route path = "user">
                    <Route index element={
                        <ProtectedRoute>
                            <UserListPage/>
                        </ProtectedRoute>
                    }/>
                    <Route path="add" element={
                        <ProtectedRoute>
                            <AddUser/>
                        </ProtectedRoute>
                    }/>
                </Route>
                <Route path = "stock">
                    <Route index element={
                        <ProtectedRoute>
                            <StockPage/>
                        </ProtectedRoute>
                    }/>
                </Route>
                <Route path="/login" element={<Login/>} />
                <Route path="404" element={<NotFoundPage/>} />
                <Route path="*" element={<Navigate to="404"/>} />
            </Routes>
        </Box>
    );
}
