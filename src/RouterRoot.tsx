import React from "react";
import {Route, Routes, Navigate} from 'react-router-dom';
import {PortfolioPage} from "./pages/portfolio/PortfolioPage";
import AddPortfolioPage from "./pages/portfolio/AddPortfolioPage";
import {ProductDetailPage} from "./pages/product_detail/ProductDetailPage";
import Box from "@mui/material/Box";
import {NotFoundPage} from "./pages/NotFoundPage";
import {HomePage} from "./pages/HomePage";
import {ProductTablePage} from "./pages/product_table/ProductTablePage";
import {PortfolioTablePage} from "./pages/portfolio/PortfolioTablePage";
import {StockPage} from "./pages/StockPage";
import {AddUser} from "./pages/user_add/AddUser";
import {UserTablePage} from "./pages/user_table/UserTablePage";
import {isEmpty, logOutMemClean} from "./util/utils";
import Login from "./pages/Login";
import {SidebarISA} from "./components/SidebarISA";
import {HeaderISA} from "./components/HeaderISA";


const ProtectedRoute = ({ children }: any) => {
    const token = sessionStorage.getItem('accessToken')
    if (isEmpty(token)) {
        logOutMemClean();
        return <Navigate to="/login" replace />
    }
    return (
        <>
            <HeaderISA/>
            <SidebarISA>
                {children}
            </SidebarISA>
        </>
    );
};

export const RouterRoot = () => {
    return (
        <Box sx={{px: '4rem', pb: '3rem', pt: '6rem', height: '1'}}>
            <Routes>
                <Route index element={
                    <ProtectedRoute>
                        <HomePage/>
                    </ProtectedRoute>
                }/>
                <Route path="portfolio">
                    <Route index element={
                        <ProtectedRoute>
                            <PortfolioTablePage/>
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
                            <ProductTablePage/>
                        </ProtectedRoute>
                    }/>
                    <Route path="id/:id" element={
                        <ProtectedRoute>
                            <ProductDetailPage/>
                        </ProtectedRoute>
                    } />
                    <Route path=":metal" element={
                        <ProtectedRoute>
                            <ProductTablePage/>
                        </ProtectedRoute>
                    }/>
                </Route>
                <Route path = "user">
                    <Route index element={
                        <ProtectedRoute>
                            <UserTablePage/>
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
                <Route path="404" element={
                    <ProtectedRoute>
                        <NotFoundPage/>
                    </ProtectedRoute>
                }/>
                <Route path="*" element={<Navigate to="404"/>} />
            </Routes>
        </Box>
    );
}
