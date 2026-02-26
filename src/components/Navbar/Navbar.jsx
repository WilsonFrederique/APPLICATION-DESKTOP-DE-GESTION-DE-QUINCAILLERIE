import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  ShoppingBag, 
  User, 
  Search, 
  Sun, 
  Moon, 
  ChevronDown,
  UserCircle,
  LogOut,
  Settings,
  ChevronLeft
} from 'lucide-react';
import styles from './Navbar.module.css';
import { MdShoppingCart } from "react-icons/md";

const Navbar = ({ onNavigate, activeSection = 'dashboard' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDarkMode] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSection, setCurrentSection] = useState(activeSection);
  const [cartCount, setCartCount] = useState(0);
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  // Déterminer la section active en fonction de l'URL
  const getSectionFromPath = (pathname) => {
    if (pathname.includes('/dashboardVendeur')) return 'dashboard';
    if (pathname.includes('/nouvelleVentesVendeur')) return 'vente';
    if (pathname.includes('/produitVendeur')) return 'produits';
    if (pathname.includes('/clients')) return 'clients';
    if (pathname.includes('/ventes') || pathname.includes('/venteHistorique') || pathname.includes('/venteFactures')) return 'ventes';
    if (pathname.includes('/paniersVendeurs')) return 'paniers';
    return 'dashboard'; // Par défaut
  };

  // Mettre à jour la section active quand l'URL change
  useEffect(() => {
    const sectionFromUrl = getSectionFromPath(location.pathname);
    setCurrentSection(sectionFromUrl);
  }, [location.pathname]);

  // Mettre à jour la section active quand la prop change (pour les cas où on navigue programmatiquement)
  useEffect(() => {
    setCurrentSection(activeSection);
  }, [activeSection]);

  // Fonction pour calculer le nombre total d'articles dans tous les paniers en cours
  const calculateTotalCartItems = useCallback(() => {
    try {
      const savedCarts = JSON.parse(localStorage.getItem('vendeurCarts') || '[]');
      const totalItems = savedCarts
        .filter(cart => cart.status === 'en_cours')
        .reduce((total, cart) => total + cart.items.length, 0);
      return totalItems;
    } catch (error) {
      console.error('Erreur lors du calcul des articles du panier:', error);
      return 0;
    }
  }, []);

  // Mettre à jour le compteur du panier
  const updateCartCount = useCallback(() => {
    const count = calculateTotalCartItems();
    setCartCount(count);
  }, [calculateTotalCartItems]);

  // Écouter les changements du localStorage
  useEffect(() => {
    // Initialiser le compteur
    updateCartCount();

    // Écouter l'événement personnalisé 'cartUpdated'
    const handleCartUpdate = () => {
      updateCartCount();
    };

    // Écouter les changements du localStorage (si modifié dans un autre onglet)
    const handleStorageChange = (e) => {
      if (e.key === 'vendeurCarts') {
        updateCartCount();
      }
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [updateCartCount]); // Ajout de updateCartCount dans les dépendances

  // Gestion du scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fermer les menus quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Appliquer le dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  // Fonction de navigation
  const handleNavigation = (section, route) => {
    setCurrentSection(section);
    if (route) {
      navigate(route);
    }
    if (onNavigate) {
      onNavigate(section);
    }
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  };

  // Fonction pour aller à la page des paniers
  const goToCarts = () => {
    handleNavigation('paniers', '/paniersVendeurs');
  };

  // Fonction de recherche
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      
      // Mapper les mots-clés aux sections et routes
      const searchMap = {
        'dashboard': { section: 'dashboard', route: '/dashboardVendeur' },
        'accueil': { section: 'dashboard', route: '/dashboardVendeur' },
        'nouvelle vente': { section: 'vente', route: '/nouvelleVentesVendeur' },
        'vente': { section: 'vente', route: '/nouvelleVentesVendeur' },
        'produits': { section: 'produits', route: '/produitVendeur' },
        'produit': { section: 'produits', route: '/produitVendeur' },
        'ventes': { section: 'ventes', route: '/ventes' },
        'historique': { section: 'ventes', route: '/venteHistoriqueVendeur' },
        'factures': { section: 'ventes', route: '/venteFacturesVendeur' },
        'clients': { section: 'clients', route: '/clients' },
        'client': { section: 'clients', route: '/clients' },
        'paniers': { section: 'paniers', route: '/paniersVendeurs' },
        'panier': { section: 'paniers', route: '/paniersVendeurs' },
        'cart': { section: 'paniers', route: '/paniersVendeurs' }
      };

      // Recherche par mot-clé
      let found = null;
      
      for (const [keyword, data] of Object.entries(searchMap)) {
        if (query.includes(keyword)) {
          found = data;
          break;
        }
      }

      if (found) {
        handleNavigation(found.section, found.route);
        setSearchQuery('');
        setIsSearchOpen(false);
      } else {
        console.log('Recherche:', searchQuery);
        // Optionnel: Afficher un toast ou message d'erreur
        alert('Aucune page trouvée pour cette recherche');
      }
    }
  };

  // Vérifier si une section est active
  const isActive = (section) => {
    return currentSection === section;
  };

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        
        {/* Logo */}
        <div className={styles.logo}>
          <button 
            onClick={() => handleNavigation('dashboard', '/dashboardVendeur')}
            className={styles.logoLink}
          >
            <span className={styles.logoText}>LOGO</span>
            <span className={styles.logoDot}>.</span>
          </button>
        </div>

        {/* Menu Desktop */}
        <div className={styles.menuDesktop}>
          <ul className={styles.navLinks}>
            <li>
              <button 
                onClick={() => handleNavigation('dashboard', '/dashboardVendeur')} 
                className={`${styles.navLink} ${isActive('dashboard') ? styles.active : ''}`}
              >
                Accueil
                {isActive('dashboard') && <div className={styles.activeIndicator} />}
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleNavigation('vente', '/nouvelleVentesVendeur')} 
                className={`${styles.navLink} ${isActive('vente') ? styles.active : ''}`}
              >
                Nouvelle vente
                {isActive('vente') && <div className={styles.activeIndicator} />}
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleNavigation('produits', '/produitVendeur')} 
                className={`${styles.navLink} ${isActive('produits') ? styles.active : ''}`}
              >
                Produits
                {isActive('produits') && <div className={styles.activeIndicator} />}
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleNavigation('clients', '/clients')} 
                className={`${styles.navLink} ${isActive('clients') ? styles.active : ''}`}
              >
                Clients
                {isActive('clients') && <div className={styles.activeIndicator} />}
              </button>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          {/* Search */}
          <div className={styles.searchWrapper} ref={searchRef}>
            <button 
              className={styles.searchBtn} 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            
            {/* Search Modal */}
            {isSearchOpen && (
              <div className={styles.searchModal}>
                <form onSubmit={handleSearch} className={styles.searchForm}>
                  <div className={styles.searchInputGroup}>
                    <Search size={20} className={styles.searchIcon} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Rechercher une page..."
                      className={styles.searchInput}
                      autoFocus
                    />
                    {searchQuery && (
                      <button 
                        type="button" 
                        onClick={() => setSearchQuery('')}
                        className={styles.clearSearch}
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                  <button type="submit" className={styles.searchSubmit}>
                    Rechercher
                  </button>
                </form>
                
                {/* Suggestions */}
                <div className={styles.searchSuggestions}>
                  <p className={styles.suggestionsTitle}>Suggestions:</p>
                  <button 
                    className={styles.suggestionItem}
                    onClick={() => {
                      setSearchQuery('Dashboard');
                      setTimeout(() => {
                        const form = document.querySelector(`.${styles.searchForm}`);
                        if (form) form.requestSubmit();
                      }, 100);
                    }}
                  >
                    Dashboard / Accueil
                  </button>
                  <button 
                    className={styles.suggestionItem}
                    onClick={() => {
                      setSearchQuery('Nouvelle vente');
                      setTimeout(() => {
                        const form = document.querySelector(`.${styles.searchForm}`);
                        if (form) form.requestSubmit();
                      }, 100);
                    }}
                  >
                    Nouvelle vente
                  </button>
                  <button 
                    className={styles.suggestionItem}
                    onClick={() => {
                      setSearchQuery('Produits');
                      setTimeout(() => {
                        const form = document.querySelector(`.${styles.searchForm}`);
                        if (form) form.requestSubmit();
                      }, 100);
                    }}
                  >
                    Produits
                  </button>
                  <button 
                    className={styles.suggestionItem}
                    onClick={() => {
                      setSearchQuery('Clients');
                      setTimeout(() => {
                        const form = document.querySelector(`.${styles.searchForm}`);
                        if (form) form.requestSubmit();
                      }, 100);
                    }}
                  >
                    Clients
                  </button>
                  <button 
                    className={styles.suggestionItem}
                    onClick={() => {
                      setSearchQuery('Paniers');
                      setTimeout(() => {
                        const form = document.querySelector(`.${styles.searchForm}`);
                        if (form) form.requestSubmit();
                      }, 100);
                    }}
                  >
                    Paniers
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Cart - Redirige vers Paniers.jsx */}
          <button 
            className={`${styles.cartBtn} ${isActive('paniers') ? styles.active : ''}`}
            onClick={goToCarts}
            aria-label="Shopping cart"
          >
            <MdShoppingCart size={20} />
            {cartCount > 0 && (
              <span className={styles.cartCount}>{cartCount}</span>
            )}
          </button>

          {/* Profile */}
          <div className={styles.profileWrapper} ref={profileRef}>
            <button 
              className={styles.profileBtn}
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              aria-label="Profile menu"
            >
              <div className={styles.profileAvatar}>
                <User size={20} />
              </div>
              <ChevronDown size={16} className={styles.profileArrow} />
            </button>
            
            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className={styles.profileDropdown}>
                <div className={styles.profileHeader}>
                  <div className={styles.profileImage}>
                    <UserCircle size={40} />
                  </div>
                  <div className={styles.profileInfo}>
                    <p className={styles.profileName}>Walle Fred</p>
                    <p className={styles.profileEmail}>wallefred@example.com</p>
                  </div>
                </div>
                
                <div className={styles.profileMenu}>
                  <button 
                    className={styles.profileMenuItem}
                    onClick={() => {
                      navigate('/profile');
                      setIsProfileOpen(false);
                    }}
                  >
                    <UserCircle size={18} />
                    <span>Mon Compte</span>
                  </button>
                  <button 
                    className={styles.profileMenuItem}
                    onClick={() => {
                      navigate('/settings');
                      setIsProfileOpen(false);
                    }}
                  >
                    <Settings size={18} />
                    <span>Paramètres</span>
                  </button>
                  <div className={styles.profileDivider}></div>
                  <button 
                    className={styles.profileMenuItemLogout}
                    onClick={() => {
                      console.log('Déconnexion');
                      setIsProfileOpen(false);
                      // Ajoutez votre logique de déconnexion ici
                    }}
                  >
                    <LogOut size={18} />
                    <span>Déconnexion</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Menu Toggle Mobile */}
          <button 
            className={styles.menuToggle}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Menu Mobile */}
        <div className={`${styles.menuMobile} ${isMenuOpen ? styles.active : ''}`}>
          {/* Header avec bouton retour */}
          <div className={styles.mobileHeader}>
            <button 
              className={styles.mobileBackBtn}
              onClick={() => setIsMenuOpen(false)}
              aria-label="Fermer le menu"
            >
              <ChevronLeft size={24} />
              <span>Retour</span>
            </button>
            
            <div className={styles.mobileProfile}>
              <div>
                <UserCircle size={40} />
              </div>
              <div>
                <p className={styles.mobileProfileName}>Walle Fred</p>
                <p className={styles.mobileProfileStatus}>En ligne</p>
              </div>
            </div>
          </div>

          <ul className={styles.navLinksMobile}>
            <li>
              <button 
                onClick={() => handleNavigation('dashboard', '/dashboardVendeur')} 
                className={`${styles.navLinkMobile} ${isActive('dashboard') ? styles.active : ''}`}
              >
                Dashboard Vendeur
                {isActive('dashboard') && <div className={styles.mobileActiveIndicator} />}
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleNavigation('vente', '/nouvelleVentesVendeur')} 
                className={`${styles.navLinkMobile} ${isActive('vente') ? styles.active : ''}`}
              >
                Nouvelle vente
                {isActive('vente') && <div className={styles.mobileActiveIndicator} />}
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleNavigation('produits', '/produitVendeur')} 
                className={`${styles.navLinkMobile} ${isActive('produits') ? styles.active : ''}`}
              >
                Produits
                {isActive('produits') && <div className={styles.mobileActiveIndicator} />}
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleNavigation('ventes', '/ventes')} 
                className={`${styles.navLinkMobile} ${isActive('ventes') ? styles.active : ''}`}
              >
                Ventes
                {isActive('ventes') && <div className={styles.mobileActiveIndicator} />}
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleNavigation('clients', '/clients')} 
                className={`${styles.navLinkMobile} ${isActive('clients') ? styles.active : ''}`}
              >
                Clients
                {isActive('clients') && <div className={styles.mobileActiveIndicator} />}
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleNavigation('paniers', '/paniersVendeurs')} 
                className={`${styles.navLinkMobile} ${isActive('paniers') ? styles.active : ''}`}
              >
                Paniers
                {cartCount > 0 && (
                  <span className={styles.mobileCartBadge}>{cartCount}</span>
                )}
                {isActive('paniers') && <div className={styles.mobileActiveIndicator} />}
              </button>
            </li>
          </ul>

          {/* Mobile Actions */}
          <div className={styles.mobileActions}>            
            <button 
              className={styles.mobileActionBtnLogout}
              onClick={() => {
                console.log('Déconnexion mobile');
                setIsMenuOpen(false);
                // Ajoutez votre logique de déconnexion ici
              }}
            >
              <LogOut size={20} />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>

        {/* Overlay */}
        {isMenuOpen && (
          <div 
            className={styles.overlay}
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </div>
    </nav>
  );
};

export default Navbar;