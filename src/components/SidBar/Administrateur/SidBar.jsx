import { useState, useEffect, useCallback, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Button from '@mui/material/Button'
import { FaAngleRight } from "react-icons/fa6"
import { IoMdNotificationsOutline } from "react-icons/io"
import { MdOutlineDashboard } from "react-icons/md"
import { IoSettingsOutline } from "react-icons/io5"
import { IoMdLogOut } from "react-icons/io"
import { FaClipboardList } from "react-icons/fa6";
import { 
  FaMoneyBillWave, 
  FaBox,    
  FaTags,        
  FaTruck,         
  FaUsers,         
  FaShoppingCart,
  FaChartBar, 
  FaChevronDown,
  FaChevronRight
} from "react-icons/fa"

const SidBar = ({ isSidebarCollapsed, onCloseMobileSidebar }) => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(0);
    const [openSubmenus, setOpenSubmenus] = useState({});
    const [isMobile, setIsMobile] = useState(false);

    // Configuration des menus avec sous-menus
    const menuStructure = useMemo(() => [
        { 
            id: 0,
            path: "/dashboardAdmin", 
            icon: <MdOutlineDashboard />, 
            label: "Dashboard Admin",
            exact: true
        },
        { 
            id: 1,
            path: "/stocksAdmin",
            icon: <FaBox />, 
            label: "Stock",
            exact: false
        },
        { 
            id: 2,
            path: "/ventesAdmin",
            icon: <FaShoppingCart />,
            label: "Ventes",
            exact: false
        },
        { 
            id: 3,
            path: "/categoriesAdmin",
            icon: <FaTags />,
            label: "Catégories",
            exact: false
        },
        { 
            id: 4,
            path: "/produitAdmin", 
            icon: <FaMoneyBillWave />,
            label: "Produits",
            exact: false
        },
        { 
            id: 5,
            path: "/commandesAdmin", 
            icon: <FaClipboardList />,
            label: "Commandes",
            exact: false
        },
        { 
            id: 6,
            path: "/fournisseursAdmin",
            icon: <FaTruck />,
            label: "Fournisseurs",
            exact: false
        },
        { 
            id: 7,
            path: "/utilisateursAdmin",
            icon: <FaUsers />,
            label: "Utilisateurs",
            exact: false
        },
        // { 
        //     id: 8,
        //     path: "/rapportsAdmin",
        //     icon: <FaChartBar />,
        //     label: "Rapports",
        //     exact: false
        // },
        { 
            id: 9,
            path: "/parametresAdmin",
            icon: <IoSettingsOutline />,
            label: "Paramètres",
            exact: false
        },
    ], []);

    // Détection mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Écouter l'événement de fermeture mobile
    useEffect(() => {
        const handleCloseMobileSidebar = () => {
            if (isMobile && onCloseMobileSidebar) {
                onCloseMobileSidebar();
            }
        };

        window.addEventListener('closeMobileSidebar', handleCloseMobileSidebar);
        return () => window.removeEventListener('closeMobileSidebar', handleCloseMobileSidebar);
    }, [isMobile, onCloseMobileSidebar]);

    // Fonction pour trouver le menu actif
    const findActiveMenu = useCallback((path) => {
        for (const menu of menuStructure) {
            // Vérifier si c'est le menu principal
            if (menu.path) {
                if (menu.exact) {
                    if (path === menu.path) return { id: menu.id, parentId: null };
                } else {
                    // ICI : Modifier pour inclure les routes enfants
                    if (path.startsWith(menu.path) || 
                        (menu.path === '/produitAdmin' && path.startsWith('/frmProduitsAdmin'))) {
                    return { id: menu.id, parentId: null };
                    } else if (path.startsWith(menu.path) || 
                        (menu.path === '/produitAdmin' && path.startsWith('/detailProduitsAdmin'))) {
                    return { id: menu.id, parentId: null };
                    } else if (path.startsWith(menu.path) || 
                        (menu.path === '/stocksAdmin' && path.startsWith('/frmStocksAdmin'))) {
                    return { id: menu.id, parentId: null };
                    } else if (path.startsWith(menu.path) || 
                        (menu.path === '/stocksAdmin' && path.startsWith('/detailStocksAdmin'))) {
                    return { id: menu.id, parentId: null };
                    } else if (path.startsWith(menu.path) || 
                        (menu.path === '/stocksAdmin' && path.startsWith('/ajusterStocksAdmin'))) {
                    return { id: menu.id, parentId: null };
                    } else if (path.startsWith(menu.path) || 
                        (menu.path === '/stocksAdmin' && path.startsWith('/reapprovisionnerStocksAdmin'))) {
                    return { id: menu.id, parentId: null };
                    } else if (path.startsWith(menu.path) || 
                        (menu.path === '/categoriesAdmin' && path.startsWith('/frmCategoriesAdmin'))) {
                    return { id: menu.id, parentId: null };
                    } else if (path.startsWith(menu.path) || 
                        (menu.path === '/categoriesAdmin' && path.startsWith('/detailCategoriesAdmin'))) {
                    return { id: menu.id, parentId: null };
                    } else if (path.startsWith(menu.path) || 
                        (menu.path === '/fournisseursAdmin' && path.startsWith('/frmFournisseursAdmin'))) {
                    return { id: menu.id, parentId: null };
                    } else if (path.startsWith(menu.path) || 
                        (menu.path === '/fournisseursAdmin' && path.startsWith('/detailFournisseursAdmin'))) {
                    return { id: menu.id, parentId: null };
                    } else if (path.startsWith(menu.path) || 
                        (menu.path === '/utilisateursAdmin' && path.startsWith('/frmUtilisateursAdmin'))) {
                    return { id: menu.id, parentId: null };
                    } else if (path.startsWith(menu.path) || 
                        (menu.path === '/utilisateursAdmin' && path.startsWith('/detailUtilisateursAdmin'))) {
                    return { id: menu.id, parentId: null };
                    } else if (path.startsWith(menu.path) || 
                        (menu.path === '/commandesAdmin' && path.startsWith('/frmCommandesAdmin'))) {
                    return { id: menu.id, parentId: null };
                    } else if (path.startsWith(menu.path) || 
                        (menu.path === '/commandesAdmin' && path.startsWith('/detailCommandesAdmin'))) {
                    return { id: menu.id, parentId: null };
                    } else if (path.startsWith(menu.path) || 
                        (menu.path === '/commandesAdmin' && path.startsWith('/validationComande'))) {
                    return { id: menu.id, parentId: null };
                    }
                }
            }
            
            // Vérifier les sous-menus
            if (menu.submenus) {
            const activeSubmenu = menu.submenus.find(sub => 
                sub.exact ? path === sub.path : path.startsWith(sub.path)
            );
            if (activeSubmenu) {
                return { id: activeSubmenu.id, parentId: menu.id };
            }
            }
        }
        return { id: 0, parentId: null }; // Par défaut Tableau de bord
    }, [menuStructure]);

    // Déterminer l'onglet actif basé sur l'URL
    useEffect(() => {
        const path = location.pathname;
        const { id: activeId, parentId } = findActiveMenu(path);
        
        // Mettre à jour l'état dans un setTimeout pour éviter le warning
        const timer = setTimeout(() => {
            setActiveTab(activeId);
            
            // Ouvrir le sous-menu parent si nécessaire
            if (parentId) {
                setOpenSubmenus(prev => ({ ...prev, [parentId]: true }));
            }
        }, 0);
        
        return () => clearTimeout(timer);
    }, [location, findActiveMenu]);

    const toggleSubmenu = useCallback((menuId) => {
        setOpenSubmenus(prev => ({
            ...prev,
            [menuId]: !prev[menuId]
        }));
    }, []);

    const handleNavigation = useCallback((menu) => {
        if (menu.submenus) {
            toggleSubmenu(menu.id);
            return;
        }
        
        // Mettre à jour l'état dans un setTimeout pour éviter le warning
        setTimeout(() => {
            setActiveTab(menu.id);
        }, 0);
        
        if (isMobile && onCloseMobileSidebar) {
            onCloseMobileSidebar();
        }
    }, [isMobile, onCloseMobileSidebar, toggleSubmenu]);

    const handleLogout = () => {
        console.log('Déconnexion...');
        // Ajoutez votre logique de déconnexion ici
        if (isMobile && onCloseMobileSidebar) {
            onCloseMobileSidebar();
        }
    };

    const renderMenuItem = (menu) => {
        const isActive = activeTab === menu.id || 
                       (menu.submenus && menu.submenus.some(sub => sub.id === activeTab));
        const hasSubmenus = menu.submenus && menu.submenus.length > 0;
        const isSubmenuOpen = openSubmenus[menu.id];

        return (
            <li key={menu.id} className="menu-item">
                {hasSubmenus ? (
                    <Button 
                        className={`menu-btn ${isActive ? 'active' : ''}`}
                        onClick={() => handleNavigation(menu)}
                    >
                        <span className='menu-icon'>{menu.icon}</span>
                        <span className="menu-label">{menu.label}</span>
                        <span className='menu-arrow'>
                            {isSubmenuOpen ? <FaChevronDown /> : <FaChevronRight />}
                        </span>
                    </Button>
                ) : (
                    <Link 
                        to={menu.path} 
                        onClick={() => handleNavigation(menu)}
                    >
                        <Button className={`menu-btn ${isActive ? 'active' : ''}`}>
                            <span className='menu-icon'>{menu.icon}</span>
                            <span className="menu-label">{menu.label}</span>
                            <span className='menu-arrow'>
                                <FaAngleRight />
                            </span>
                        </Button>
                    </Link>
                )}
                
                {/* Sous-menus */}
                {hasSubmenus && isSubmenuOpen && (
                    <ul className="submenu">
                        {menu.submenus.map(submenu => {
                            const isSubActive = activeTab === submenu.id;
                            return (
                                <li key={submenu.id} className="submenu-item">
                                    <Link 
                                        to={submenu.path} 
                                        onClick={() => handleNavigation(submenu)}
                                    >
                                        <Button className={`submenu-btn ${isSubActive ? 'active' : ''}`}>
                                            <span className='submenu-icon'>{submenu.icon}</span>
                                            <span className="submenu-label">{submenu.label}</span>
                                        </Button>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </li>
        );
    };

    return (
        <>
            <div className="sidebar">
                <div className="sidebar-content">
                    <ul className="sidebar-menu">
                        {menuStructure.map(renderMenuItem)}
                    </ul>
                </div>

                {/* Section déconnexion - Toujours en bas */}
                <div className="sidebar-footer">
                    <div className="logout-wrapper">
                        <button 
                            className="logout-btn"
                            onClick={handleLogout}
                            aria-label={isSidebarCollapsed ? "Déconnexion" : ""}
                        >
                            <div className="logout-icon">
                                <IoMdLogOut />
                            </div>

                            &nbsp;
                            
                            {!isSidebarCollapsed ? (
                                <div className="logout-content">
                                    <span className="logout-text">Se déconnecter</span>
                                    <span className="logout-email">admin@example.com</span>
                                </div>
                            ) : (
                                <div className="logout-tooltip">Déconnexion</div>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SidBar;