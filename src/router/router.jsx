import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Commands from "../pages/Commands";
import Customers from "../pages/Customers";
import Dashboard from "../pages/Dashboard";
import Login from "../auth/Login";
import Products from "../pages/Products";
import Providers from "../pages/Providers";
import Sales from "../pages/Sales";
import Stocks from "../pages/Stocks";

const getUserFromStorage = () => {
    try {
        const userStr = localStorage.getItem("user");
        return userStr ? JSON.parse(userStr) : null;
    } catch {
        return null;
    }
};

const ProtectedRoute = ({ requiredRole }) => {
    const user = getUserFromStorage();
    const token = localStorage.getItem("token");

    if (!token || !user) return <Navigate to="/" replace />;

    // const userRole = user.role === "admin" ? "admin" : user.role;

    // if (requiredRole && userRole !== requiredRole) {
    //   return <Navigate to="/dashboard" replace />;
    // }

    return <Outlet />;
};

function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Navigate to="/" replace />} />

                <Route element={<ProtectedRoute requiredRole="vendeur" />}>
                    <Route element={<MainLayout />}>
                        <Route path="/commands" element={<Commands />} />
                        <Route path="/customers" element={<Customers />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/providers" element={<Providers />} />
                        <Route path="/sales" element={<Sales />} />
                        <Route path="/stocks" element={<Stocks />} />

                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default Router;
