import React, {useEffect, useState} from "react";
import {Route, Routes, Navigate, useNavigate} from 'react-router-dom';
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
import {getSessionUser, isAdmin, isEmpty, logOutMemClean} from "./util/utils";
import Login from "./pages/Login";
import {SideNavigationISA} from "./components/SideNavigationISA";
import {HeaderISA} from "./components/HeaderISA";
import {AnalyticPage} from "./pages/AnalyticPage";


const AdminRoute = ({ children }: any) => {
    const navigate = useNavigate();

    const role = getSessionUser(navigate)?.account?.role
    if (!isAdmin(role)) {
        return <Navigate to="/" replace />
    }
    return children;
};


const ProtectedRoute = ({ children }: any) => {
    const token = localStorage.getItem('accessToken')
    if (isEmpty(token)) {
        logOutMemClean();
        return <Navigate to="/login" replace />
    }
    return (
        <>
            <HeaderISA/>
            <SideNavigationISA>
                {children}
            </SideNavigationISA>
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
                        <AdminRoute>
                            <ProtectedRoute>
                                <UserTablePage/>
                            </ProtectedRoute>
                        </AdminRoute>
                    }/>
                    <Route path="add" element={
                        <AdminRoute>
                            <ProtectedRoute>
                                <AddUser/>
                            </ProtectedRoute>
                        </AdminRoute>
                    }/>
                </Route>
                <Route path = "stock">
                    <Route index element={
                        <ProtectedRoute>
                            <StockPage/>
                        </ProtectedRoute>
                    }/>
                </Route>
                <Route path = "analytic">
                    <Route index element={
                        <ProtectedRoute>
                            <AnalyticPage/>
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
