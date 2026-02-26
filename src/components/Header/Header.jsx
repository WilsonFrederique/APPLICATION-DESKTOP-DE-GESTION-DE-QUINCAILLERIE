import React, { useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import Divider from '@mui/material/Divider'
import Logout from '@mui/icons-material/Logout'
import { 
  MdOutlineLightMode,
  MdOutlineDarkMode,
  MdMenuOpen,
  MdOutlineMenu
} from "react-icons/md"
import { 
  FaRegBell,
  FaSearch
} from "react-icons/fa"
import { IoMenu } from "react-icons/io5"
import { MdOutlineShoppingCart } from "react-icons/md";
import { MyContext } from '../../App'

const Header = () => {
    const [notificationAnchor, setNotificationAnchor] = useState(null)
    const [isMobile, setIsMobile] = useState(false)
    const openNotifications = Boolean(notificationAnchor)

    const context = useContext(MyContext)

    // Détection mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleOpenNotifications = (event) => {
        setNotificationAnchor(event.currentTarget)
    }
    
    const handleCloseNotifications = () => {
        setNotificationAnchor(null)
    }

    const toggleMobileSidebar = () => {
        context.toggleNav();
        
        // Dispatch l'événement pour le toggle
        const event = new CustomEvent('toggleMobileSidebar');
        window.dispatchEvent(event);
    }

    const toggleDesktopSidebar = () => {
        if (context.setIsToggleSidebar) {
            context.setIsToggleSidebar();
        }
    }

    return (
        <>
            <header className='header-container'>
                <div className="header-content">
                    {/* Logo */}
                    <div className="header-logo">
                        <Link to="/" className='logo-link'>
                            <div className="logo-wrapper">
                                <div className="logo-text">
                                    <span className="logo-primary">LOGO</span>
                                    <span className="logo-secondary">Dashboard</span>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Bouton toggle sidebar pour desktop */}
                    {!isMobile && (
                        <div className="sidebar-toggle-wrapper hidden-mobile">
                            <Button 
                                className='sidebar-toggle-btn' 
                                onClick={toggleDesktopSidebar}
                            >
                                {context.isToggleSidebar ? <MdMenuOpen /> : <MdOutlineMenu />}
                            </Button>
                        </div>
                    )}

                    {/* Barre de recherche (seulement sur desktop) */}
                    {!isMobile && (
                        <div className="search-wrapper hidden-mobile">
                            <div className="search-box">
                                <FaSearch className="search-icon" />
                                <input 
                                    type="text" 
                                    placeholder="Rechercher..." 
                                    className="search-input"
                                />
                            </div>
                        </div>
                    )}

                    {/* Actions utilisateur */}
                    <div className="user-actions">
                        {/* Bouton thème */}
                        <Button 
                            className="action-btn theme-toggle" 
                            onClick={context.setThemeMode}
                        > 
                            {context.themeMode === 'dark' ? <MdOutlineLightMode /> : <MdOutlineDarkMode />}
                        </Button>

                        {/* Bouton notifications */}
                        <div className="notification-wrapper">
                            <Button 
                                className="action-btn notification-btn" 
                                onClick={handleOpenNotifications}
                            > 
                                <MdOutlineShoppingCart /> 
                                <span className="notification-badge">12</span>
                            </Button>
                            
                            <Menu
                                anchorEl={notificationAnchor}
                                open={openNotifications}
                                onClose={handleCloseNotifications}
                                className='notifications-dropdown'
                                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            >
                                <div className="dropdown-header">
                                    <h4>Notifications (12)</h4>
                                </div>
                                <Divider />
                                <div className="dropdown-content">
                                    <div className="notification-item">
                                        <div className="notification-icon">
                                            <FaRegBell />
                                        </div>
                                        <div className="notification-info">
                                            <p className="notification-title">Nouveau rapport disponible</p>
                                            <p className="notification-time">Il y a 5 minutes</p>
                                        </div>
                                    </div>
                                    <Divider />
                                    <div className="dropdown-footer">
                                        <Button className='btn-primary w-100'>
                                            Voir toutes les notifications
                                        </Button>
                                    </div>
                                </div>
                            </Menu>
                        </div>

                        {/* Bouton menu mobile */}
                        {isMobile && (
                            <Button 
                                className="action-btn mobile-menu-btn visible-mobile" 
                                onClick={toggleMobileSidebar}
                            >
                                <IoMenu />
                            </Button>
                        )}

                        {/* Profil utilisateur */}
                        {context.isLogin && (
                            <div className="user-profile-wrapper">
                                <Button 
                                    className="pdp" 
                                >
                                    <div className="user-avatar">
                                        <div className="avatar-circle">
                                            <span>PDP</span>
                                        </div>
                                    </div>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header