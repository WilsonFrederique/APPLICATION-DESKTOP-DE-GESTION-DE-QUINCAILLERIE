import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Menu, X, User, ChevronDown,
  UserCircle, LogOut, Settings, Eye, EyeOff,
} from 'lucide-react';
import styles from './Navbar.module.css';

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Accueil',  route: '/dashboardVendeur' },
  { key: 'vente',     label: 'Vente',    route: '/nouvelleVentesVendeur' },
  { key: 'produits',  label: 'Produits', route: '/produitVendeur' },
  { key: 'stock',     label: 'Stock',    route: '/stockVendeur' },
  { key: 'clients',   label: 'Clients',  route: '/clients' },
];

const Navbar = ({ onNavigate, activeSection = 'dashboard' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isMenuOpen,     setIsMenuOpen]     = useState(false);
  const [isScrolled,     setIsScrolled]     = useState(false);
  const [isProfileOpen,  setIsProfileOpen]  = useState(false);
  const [isNavVisible,   setIsNavVisible]   = useState(true);
  const [currentSection, setCurrentSection] = useState(activeSection);

  const profileRef = useRef(null);

  const getSectionFromPath = (pathname) => {
    if (pathname.includes('/dashboardVendeur'))      return 'dashboard';
    if (pathname.includes('/nouvelleVentesVendeur')) return 'vente';
    if (pathname.includes('/produitVendeur'))        return 'produits';
    if (pathname.includes('/stockVendeur'))          return 'stock';
    if (pathname.includes('/clients'))               return 'clients';
    if (pathname.includes('/ventes') || pathname.includes('/venteHistorique') || pathname.includes('/venteFactures')) return 'ventes';
    return 'dashboard';
  };

  useEffect(() => { setCurrentSection(getSectionFromPath(location.pathname)); }, [location.pathname]);
  useEffect(() => { setCurrentSection(activeSection); }, [activeSection]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setIsProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleNavigation = (section, route) => {
    setCurrentSection(section);
    if (route) navigate(route);
    if (onNavigate) onNavigate(section);
    setIsMenuOpen(false);
  };

  const isActive = (section) => currentSection === section;

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>

        {/* Logo */}
        <button onClick={() => handleNavigation('dashboard', '/dashboardVendeur')} className={styles.logoLink}>
          <span className={styles.logoText}>QUINCAILLERIE</span>
          <span className={styles.logoDot}>.</span>
        </button>

        {/* Desktop Nav */}
        <div className={`${styles.menuDesktop} ${isNavVisible ? styles.navVisible : styles.navHidden}`}>
          <ul className={styles.navLinks}>
            {NAV_ITEMS.map(({ key, label, route }) => (
              <li key={key}>
                <button
                  onClick={() => handleNavigation(key, route)}
                  className={`${styles.navLink} ${isActive(key) ? styles.active : ''}`}
                >
                  {label}
                  {isActive(key) && <span className={styles.activeBar} />}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className={styles.actions}>

          {/* Toggle nav */}
          <button
            className={styles.iconBtn}
            onClick={() => setIsNavVisible(v => !v)}
            title={isNavVisible ? 'Cacher le menu' : 'Afficher le menu'}
          >
            {isNavVisible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>

          {/* Profile */}
          <div className={styles.profileWrapper} ref={profileRef}>
            <button
              className={`${styles.profileBtn} ${isProfileOpen ? styles.profileBtnOpen : ''}`}
              onClick={() => setIsProfileOpen(o => !o)}
            >
              <div className={styles.avatar}><User size={16} /></div>
              <ChevronDown size={14} className={`${styles.chevron} ${isProfileOpen ? styles.chevronOpen : ''}`} />
            </button>

            {isProfileOpen && (
              <div className={styles.dropdown}>
                <div className={styles.profileHeader}>
                  <div className={styles.profileAvatar}><UserCircle size={32} /></div>
                  <div>
                    <p className={styles.profileName}>Admin</p>
                    <p className={styles.profileEmail}>admin</p>
                  </div>
                </div>
                <div className={styles.divider} />
                <ul className={styles.menuList}>
                  <li>
                    <button className={styles.menuItem} onClick={() => { navigate('/profile'); setIsProfileOpen(false); }}>
                      <UserCircle size={16} /><span>Mon Compte</span>
                    </button>
                  </li>
                  <li>
                    <button className={styles.menuItem} onClick={() => { navigate('/settings'); setIsProfileOpen(false); }}>
                      <Settings size={16} /><span>Paramètres</span>
                    </button>
                  </li>
                </ul>
                <div className={styles.divider} />
                <div className={styles.menuListPadded}>
                  <button className={`${styles.menuItem} ${styles.menuItemDanger}`} onClick={() => setIsProfileOpen(false)}>
                    <LogOut size={16} /><span>Déconnexion</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className={`${styles.iconBtn} ${styles.mobileOnly}`} onClick={() => setIsMenuOpen(o => !o)}>
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div className={`${styles.drawer} ${isMenuOpen ? styles.drawerOpen : ''}`}>
        <div className={styles.drawerHeader}>
          <div className={styles.drawerProfile}>
            <UserCircle size={36} />
            <div>
              <p className={styles.profileName}>Admin</p>
            </div>
          </div>
          <button className={styles.drawerCloseBtn} onClick={() => setIsMenuOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <div className={styles.divider} />

        <ul className={styles.drawerLinks}>
          {[...NAV_ITEMS, { key: 'ventes', label: 'Ventes', route: '/ventes' }].map(({ key, label, route }) => (
            <li key={key}>
              <button
                onClick={() => handleNavigation(key, route)}
                className={`${styles.drawerLink} ${isActive(key) ? styles.drawerLinkActive : ''}`}
              >
                {isActive(key) && <span className={styles.drawerActiveDot} />}
                {label}
              </button>
            </li>
          ))}
        </ul>

        <div className={styles.divider} style={{ marginTop: 'auto' }} />
        <div className={styles.drawerFooter}>
          <button className={`${styles.menuItem} ${styles.menuItemDanger} ${styles.drawerLogout}`} onClick={() => setIsMenuOpen(false)}>
            <LogOut size={16} /><span>Déconnexion</span>
          </button>
        </div>
      </div>

      {isMenuOpen && <div className={styles.overlay} onClick={() => setIsMenuOpen(false)} />}
    </nav>
  );
};

export default Navbar;