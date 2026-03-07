import React, { createContext } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";

import Header from "./components/Layout/Header";
import Login from "./auth/Login";
import Dashboard from "./components/Dashboard/Vendeur/Dashboard";
import Sales from "./pages/Sales";
import Products from "./pages/Products";
import Customers from "./pages/Vendeur/Clients/Clients";
import Stocks from "./pages/Vendeur/Stocks/Stocks";

// Contexte global
const MyContext = createContext();

// Récupération de l'utilisateur depuis le localStorage
const getUserFromStorage = () => {
  try {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

// Composant de protection de route
const ProtectedRoute = ({ requiredRole }) => {
  const user = getUserFromStorage();
  const token = localStorage.getItem("token");

  if (!token || !user) return <Navigate to="/" replace />;

  const userRole = user.role === "admin" ? "admin" : user.role;

  // if (requiredRole && userRole !== requiredRole) {
  //   return <Navigate to="/dashboard" replace />;
  // }

  return <Outlet />;
};

// Layout principal
const MainLayout = () => {
  const location = useLocation();

  // On cache le layout pour la page login
  const hideLayout = location.pathname === "/" || location.pathname === "/login";

  if (hideLayout) return <Outlet />;

  return (
    <>
      <Header />
      <div className="h-[calc(100vh-40px)] mt-[45px]">
        <Outlet />
      </div>
    </>
  );
};

export default function App() {
  const contextValue = {}; // Ajoute ici tes valeurs à partager via MyContext

  return (
    <BrowserRouter>
      <MyContext.Provider value={contextValue}>
        <Routes>
          {/* Page login */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Navigate to="/" replace />} />

          {/* Routes protégées */}
          <Route element={<ProtectedRoute requiredRole="vendeur" />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/products" element={<Products />} />
              <Route path="/stocks" element={<Stocks />} />
              <Route path="/customers" element={<Customers />} />
              
              {/* Redirection routes inconnues */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Route>
        </Routes>
      </MyContext.Provider>
    </BrowserRouter>
  );
}

export { MyContext };