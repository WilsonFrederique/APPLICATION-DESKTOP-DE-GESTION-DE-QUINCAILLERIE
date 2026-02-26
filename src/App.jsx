import React, { createContext, useEffect, useState, useCallback, useMemo } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

import Login from "./auth/Login";

// import Header from "./components/Header/Header";
import Navbar from "./components/Navbar/Navbar";
import SidBarAdmin from "./components/SidBar/Administrateur/SidBar";

import DashboardAdmin from "./components/Dashboard/Administrateur/Dashboard";

import ProduitsAdmin from "./pages/Administrateur/Produits/Produits";
import FrmProduitsAdmin from "./pages/Administrateur/Produits/FrmProduits";
import DetailProduitsAdmin from "./pages/Administrateur/Produits/DetailProduits";

import CommandesAdmin from "./pages/Administrateur/Commandes/Commandes";
import FrmCommandesAdmin from "./pages/Administrateur/Commandes/FrmCommandes";
import DetailCommandesAdmin from "./pages/Administrateur/Commandes/DetailCommandes";
import ValidationComande from "./pages/Administrateur/Commandes/Validation";

import StocksAdmin from "./pages/Administrateur/Stocks/Stocks";
import FrmStocksAdmin from "./pages/Administrateur/Stocks/FrmStocks";
import DetailStocksAdmin from "./pages/Administrateur/Stocks/DetailStocks";
import AjusterStocksAdmin from "./pages/Administrateur/Stocks/AjusterStocks";
import ReapprovisionnerStocksAdmin from "./pages/Administrateur/Stocks/ReapprovisionnerStocks";

import CategoriesAdmin from "./pages/Administrateur/Categories/Categories";
import FrmCategoriesAdmin from "./pages/Administrateur/Categories/FrmCategories";
import DetailCategoriesAdmin from "./pages/Administrateur/Categories/DetailCategories";

import FournisseursAdmin from "./pages/Administrateur/Fournisseurs/Fournisseurs";
import FrmFournisseursAdmin from "./pages/Administrateur/Fournisseurs/FrmFournisseurs";
import DetailFournisseursAdmin from "./pages/Administrateur/Fournisseurs/DetailFournisseurs";

import UtilisateursAdmin from "./pages/Administrateur/Utilisateurs/Utilisateurs";
import FrmUtilisateursAdmin from "./pages/Administrateur/Utilisateurs/FrmUtilisateurs";
import DetailUtilisateursAdmin from "./pages/Administrateur/Utilisateurs/DetailUtilisateurs";

import VentesAdmin from "./pages/Administrateur/Ventes/Ventes";

import RapportsAdmin from "./pages/Administrateur/Rapports/Rapports";

import ParametresAdmin from "./pages/Administrateur/Parametres/Parametres";

////////////////////////////////////////////////////////////////////////////

// import SidBarVendeur from "./components/SidBar/Vendeur/SidBar";
import DashboardVendeur from "./components/Dashboard/Vendeur/Dashboard";

import NouvelleVentesVendeur from "./pages/Vendeur/NouvelleVentes/NouvelleVentes";

import ProduitsVendeur from "./pages/Vendeur/Produits/Produits";
import FrmProduitsVendeur from "./pages/Vendeur/Produits/FrmProduits";
import DetailProduitsVendeur from "./pages/Vendeur/Produits/DetailProduits";

import PaniersVendeurs from "./pages/Vendeur/Paniers/Paniers";

import VenteHistoriqueVendeur from "./pages/Vendeur/Ventes/VenteHistorique";
import VenteFacturesVendeur from "./pages/Vendeur/Ventes/VenteFactures";

import Clients from "./pages/Vendeur/Clients/Clients";
import FrmClients from "./pages/Vendeur/Clients/FrmClients";
import DetailClients from "./pages/Vendeur/Clients/DetailClients";

const MyContext = createContext();

// Helper functions
const getUserFromStorage = () => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

const getDashboardPathByRole = (role) => {
  // Normaliser le rôle
  const normalizedRole = role === 'administrateur' ? 'admin' : role;
  
  switch (normalizedRole) {
    case 'admin':
      return "/dashboardAdmin";
    case 'vendeur':
      return "/dashboardVendeur";
    default:
      return "/";
  }
};

// Composant de protection de route
const ProtectedRoute = ({ children, requiredRole }) => {
  const user = getUserFromStorage();
  const token = localStorage.getItem('token');

  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  // Normaliser les rôles
  const userRole = user.role === 'administrateur' ? 'admin' : user.role;
  
  if (requiredRole && userRole !== requiredRole) {
    const dashboardPath = getDashboardPathByRole(userRole);
    return <Navigate to={dashboardPath} replace />;
  }

  return children;
};

// Composant qui redirige vers le dashboard approprié après login
const DashboardRedirect = () => {
  const user = getUserFromStorage();
  const token = localStorage.getItem('token');
  
  if (!token || !user) {
    return <Navigate to="/" replace />;
  }
  
  const dashboardPath = getDashboardPathByRole(user.role);
  return <Navigate to={dashboardPath} replace />;
};

const MainLayout = ({ children }) => {
  const context = React.useContext(MyContext);
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  
  const user = getUserFromStorage();
  
  // Vérifier si nous sommes sur une page sans sidebar/header
  const hideLayout = location.pathname === "/" || location.pathname === "/login";
  
  // Détection de l'appareil mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Gérer la fermeture du sidebar sur mobile
  useEffect(() => {
    if (isMobile && context?.isOpenNav) {
      const handleClickOutside = (e) => {
        if (!e.target.closest('.sidebarWrapper') && !e.target.closest('.menu-2')) {
          context?.closeNav?.();
        }
      };
      
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
    return () => {};
  }, [isMobile, context]);

  // Rendre le Sidebar approprié selon le rôle
  const renderSidebar = () => {
    if (!user) return null;
    
    // Normaliser le rôle
    const userRole = user.role === 'administrateur' ? 'admin' : user.role;
    
    switch (userRole) {
      case 'admin':
        return null; 
      case 'vendeur':
        return null;        
    }
  };

  if (hideLayout) {
    return <>{children}</>;
  }

  if (!context) {
    return <div>Erreur de contexte</div>;
  }

  return (
    <>
      <Navbar />
      <div className="main d-flex">
        {/* Overlay pour mobile */}
        {isMobile && context.isOpenNav && (
          <div 
            className="sidebarOverlay show" 
            onClick={context.closeNav}
          />
        )}
        
        {/* Sidebar dynamique selon le rôle */}
        <div 
          className={`sidebarWrapper ${context.isToggleSidebar ? "toggle" : ""} ${
            context.isOpenNav ? 'open' : ''
          }`}
        >
          {renderSidebar()}
        </div>

        {/* Contenu principal */}
        <div className={`content ${context.isToggleSidebar && "toggle"}`}>
          {children}
        </div>
      </div>
    </>
  );
};

export default function App() {
  // Initialisation des états avec localStorage
  const [themeMode, setThemeMode] = useState(() => {
    const savedTheme = localStorage.getItem('themeMode');
    return savedTheme !== null ? savedTheme === 'light' : true;
  });

  const [isOpenNav, setIsOpenNav] = useState(() => {
    const saved = localStorage.getItem('isOpenNav');
    return saved === "true" || false;
  });

  const [isToggleSidebar, setIsToggleSidebar] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Gestion du thème
  useEffect(() => {
    const themeClass = themeMode ? 'light' : 'dark';
    const oppositeClass = themeMode ? 'dark' : 'light';
    
    document.body.classList.remove(oppositeClass);
    document.body.classList.add(themeClass);
    localStorage.setItem('themeMode', themeClass);
  }, [themeMode]);

  // Gestion du resize de la fenêtre
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      // Fermer le sidebar sur mobile quand la fenêtre est redimensionnée
      if (window.innerWidth >= 768 && isOpenNav) {
        setIsOpenNav(false);
        localStorage.setItem('isOpenNav', "false");
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpenNav]);

  // Utiliser useCallback pour stabiliser les fonctions
  const closeNav = useCallback(() => {
    setIsOpenNav(false);
    localStorage.setItem('isOpenNav', "false");
  }, []);
  
  const openNav = useCallback(() => {
    setIsOpenNav(true);
    localStorage.setItem('isOpenNav', "true");
  }, []);
  
  const toggleNav = useCallback(() => {
    setIsOpenNav(prev => {
      const newState = !prev;
      localStorage.setItem('isOpenNav', newState.toString());
      return newState;
    });
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeMode(prev => !prev);
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsToggleSidebar(prev => !prev);
  }, []);

  // Utiliser useMemo pour stabiliser l'objet context
  const values = useMemo(() => ({
    isToggleSidebar,
    setIsToggleSidebar: toggleSidebar,
    themeMode,
    setThemeMode: toggleTheme,
    windowWidth,
    isOpenNav,
    openNav,
    closeNav,
    toggleNav
  }), [
    isToggleSidebar,
    toggleSidebar,
    themeMode,
    toggleTheme,
    windowWidth,
    isOpenNav,
    openNav,
    closeNav,
    toggleNav
  ]);

  return (
    <BrowserRouter>
      <MyContext.Provider value={values}>
        
        <Routes>
          {/* Route publique - Page de login */}
          <Route path="/" element={
            <>
              <Login />
            </>
          } />
          <Route path="/login" element={<Navigate to="/" replace />} />

          {/* Routes protégées avec layout */}
          <Route path="/*" element={
            <ProtectedRoute>
              <MainLayout>
                <Routes>
                  {/* Route qui redirige vers le dashboard approprié */}
                  <Route path="/dashboard" element={<DashboardRedirect />} />
                  
                  {/* Routes Admin */}
                  <Route path="/dashboardAdmin" element={
                    <ProtectedRoute requiredRole="admin">
                      <DashboardAdmin />
                    </ProtectedRoute>
                  } />
                  <Route path="/produitAdmin" element={
                    <ProtectedRoute requiredRole="admin">
                      <ProduitsAdmin />
                    </ProtectedRoute>
                  } />
                  <Route path="/frmProduitsAdmin" element={
                    <ProtectedRoute requiredRole="admin">
                      <FrmProduitsAdmin />
                    </ProtectedRoute>
                  } />
                  <Route path="/frmProduitsAdmin/:id" element={
                    <ProtectedRoute requiredRole="admin">
                      <FrmProduitsAdmin />
                    </ProtectedRoute>
                  } />
                  <Route path="/detailProduitsAdmin/:id" element={
                    <ProtectedRoute requiredRole="admin">
                      <DetailProduitsAdmin />
                    </ProtectedRoute>
                  } />
                  <Route path="/commandesAdmin" element={
                    <ProtectedRoute requiredRole="admin">
                      <CommandesAdmin />
                    </ProtectedRoute>
                  } />
                  <Route path="/frmCommandesAdmin" element={
                    <ProtectedRoute requiredRole="admin">
                      <FrmCommandesAdmin />
                    </ProtectedRoute>
                  } />
                  <Route path="/frmCommandesAdmin/:id" element={
                    <ProtectedRoute requiredRole="admin">
                      <FrmCommandesAdmin />
                    </ProtectedRoute>
                  } />
                  <Route path="/detailCommandesAdmin/:id" element={
                    <ProtectedRoute requiredRole="admin">
                      <DetailCommandesAdmin />
                    </ProtectedRoute>
                  } />
                  <Route path="/validationComande/:id" element={
                    <ProtectedRoute requiredRole="admin">
                      <ValidationComande />
                    </ProtectedRoute>
                  } />
                  <Route path="/stocksAdmin" element={
                    <ProtectedRoute requiredRole="admin">
                      <StocksAdmin />
                    </ProtectedRoute>
                  } />
                  <Route path="/frmStocksAdmin" element={
                    <ProtectedRoute requiredRole="admin">
                      <FrmStocksAdmin />
                    </ProtectedRoute>
                  } />
                  <Route path="/frmStocksAdmin/:id" element={
                    <ProtectedRoute requiredRole="admin">
                      <FrmStocksAdmin />
                    </ProtectedRoute>
                  } />
                  <Route path="/detailStocksAdmin/:id" element={
                    <ProtectedRoute requiredRole="admin">
                      <DetailStocksAdmin />
                    </ProtectedRoute>
                  } />
                  <Route path="/ajusterStocksAdmin/:id" element={
                    <ProtectedRoute requiredRole="admin">
                      <AjusterStocksAdmin />
                    </ProtectedRoute>
                  } />
                  <Route path="/reapprovisionnerStocksAdmin/:id" element={
                    <ProtectedRoute requiredRole="admin">
                      <ReapprovisionnerStocksAdmin />
                    </ProtectedRoute>
                  } />
                  <Route path="/categoriesAdmin" element={
                    <ProtectedRoute requiredRole="admin">
                      <CategoriesAdmin />
                    </ProtectedRoute>
                  } />
                  <Route path="/frmCategoriesAdmin" element={
                    <ProtectedRoute requiredRole="admin">
                      <FrmCategoriesAdmin />
                    </ProtectedRoute>
                  } />
                  <Route path="/frmCategoriesAdmin/:id" element={
                    <ProtectedRoute requiredRole="admin">
                      <FrmCategoriesAdmin />
                    </ProtectedRoute>
                  } />
                  <Route path="/detailCategoriesAdmin/:id" element={
                    <ProtectedRoute requiredRole="admin">
                      <DetailCategoriesAdmin />
                    </ProtectedRoute>
                  } />
                  <Route path="/fournisseursAdmin" element={
                    <ProtectedRoute requiredRole="admin">
                      <FournisseursAdmin />
                    </ProtectedRoute>
                  } />
                  <Route path="/frmFournisseursAdmin" element={
                    <ProtectedRoute requiredRole="admin">
                      <FrmFournisseursAdmin />
                    </ProtectedRoute>
                  } />
                  <Route path="/frmFournisseursAdmin/:id" element={
                    <ProtectedRoute requiredRole="admin">
                      <FrmFournisseursAdmin />
                    </ProtectedRoute>
                  } />
                  <Route path="/detailFournisseursAdmin/:id" element={
                    <ProtectedRoute requiredRole="admin">
                      <DetailFournisseursAdmin />
                    </ProtectedRoute>
                  } />
                  <Route path="/utilisateursAdmin" element={
                    <ProtectedRoute requiredRole="admin">
                      <UtilisateursAdmin />
                    </ProtectedRoute>
                  } />
                  <Route path="/frmUtilisateursAdmin" element={
                    <ProtectedRoute requiredRole="admin">
                      <FrmUtilisateursAdmin />
                    </ProtectedRoute>
                  } />
                  <Route path="/frmUtilisateursAdmin/:id" element={
                    <ProtectedRoute requiredRole="admin">
                      <FrmUtilisateursAdmin />
                    </ProtectedRoute>
                  } />
                  <Route path="/detailUtilisateursAdmin/:id" element={
                    <ProtectedRoute requiredRole="admin">
                      <DetailUtilisateursAdmin />
                    </ProtectedRoute>
                  } />
                  <Route path="/ventesAdmin" element={
                    <ProtectedRoute requiredRole="admin">
                      <VentesAdmin />
                    </ProtectedRoute>
                  } />
                  <Route path="/rapportsAdmin" element={
                    <ProtectedRoute requiredRole="admin">
                      <RapportsAdmin />
                    </ProtectedRoute>
                  } />
                  <Route path="/parametresAdmin" element={
                    <ProtectedRoute requiredRole="admin">
                      <ParametresAdmin />
                    </ProtectedRoute>
                  } />
                  


                  {/* Routes Vendeur */}
                  <Route path="/dashboardVendeur" element={
                    <ProtectedRoute requiredRole="vendeur">
                      <DashboardVendeur />
                    </ProtectedRoute>
                  } />
                  <Route path="/nouvelleVentesVendeur" element={
                    <ProtectedRoute requiredRole="vendeur">
                      <NouvelleVentesVendeur />
                    </ProtectedRoute>
                  } />
                  <Route path="/produitVendeur" element={
                    <ProtectedRoute requiredRole="vendeur">
                      <ProduitsVendeur />
                    </ProtectedRoute>
                  } />
                  <Route path="/frmProduitsVendeur" element={
                    <ProtectedRoute requiredRole="vendeur">
                      <FrmProduitsVendeur />
                    </ProtectedRoute>
                  } />
                  <Route path="/frmProduitsVendeur/:id" element={
                    <ProtectedRoute requiredRole="vendeur">
                      <FrmProduitsVendeur />
                    </ProtectedRoute>
                  } />
                  <Route path="/detailProduitsVendeur/:id" element={
                    <ProtectedRoute requiredRole="vendeur">
                      <DetailProduitsVendeur />
                    </ProtectedRoute>
                  } />
                  <Route path="/paniersVendeurs" element={
                    <ProtectedRoute requiredRole="vendeur">
                      <PaniersVendeurs />
                    </ProtectedRoute>
                  } />
                  <Route path="/paniersVendeurs/:id" element={
                    <ProtectedRoute requiredRole="vendeur">
                      <PaniersVendeurs />
                    </ProtectedRoute>
                  } />
                  <Route path="/venteHistoriqueVendeur" element={
                    <ProtectedRoute requiredRole="vendeur">
                      <VenteHistoriqueVendeur />
                    </ProtectedRoute>
                  } />
                  <Route path="/venteFacturesVendeur" element={
                    <ProtectedRoute requiredRole="vendeur">
                      <VenteFacturesVendeur />
                    </ProtectedRoute>
                  } />
                  <Route path="/clients" element={
                    <ProtectedRoute requiredRole="vendeur">
                      <Clients />
                    </ProtectedRoute>
                  } />
                  <Route path="/frmClients" element={
                    <ProtectedRoute requiredRole="vendeur">
                      <FrmClients />
                    </ProtectedRoute>
                  } />
                  <Route path="/frmClients/:id" element={
                    <ProtectedRoute requiredRole="vendeur">
                      <FrmClients />
                    </ProtectedRoute>
                  } />
                  <Route path="/detailClients/:id" element={
                    <ProtectedRoute requiredRole="vendeur">
                      <DetailClients />
                    </ProtectedRoute>
                  } />

                  {/* Redirection vers le dashboard approprié pour les routes inconnues */}
                  <Route path="*" element={<DashboardRedirect />} />
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </MyContext.Provider>
    </BrowserRouter>
  );
}

export { MyContext };