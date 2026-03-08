import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Accueil', route: '/dashboard' },
  { key: 'sales', label: 'Vente', route: '/sales' },
  { key: 'commands', label: 'Commandes', route: '/commands' },
  { key: 'stocks', label: 'Stock', route: '/stocks' },
  { key: 'products', label: 'Produits', route: '/products' },
  { key: 'providers', label: 'Fournisseurs', route: '/providers' },
  { key: 'customers', label: 'Clients', route: '/customers' },
];

const Header = ({ onNavigate, activeSection = 'dashboard' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [currentSection, setCurrentSection] = useState(activeSection);

  const appName = import.meta.env.VITE_APP_NAME;

  const getSectionFromPath = (pathname) => {
    if (pathname.includes('/dashboard')) return 'dashboard';
    if (pathname.includes('/sales')) return 'sales';
    if (pathname.includes('/products')) return 'products';
    if (pathname.includes('/stocks')) return 'stocks';
    if (pathname.includes('/customers')) return 'customers';
    if (pathname.includes('/providers')) return 'providers';
    if (pathname.includes('/commands')) return 'commands';
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
    <nav className={`fixed top-0 left-0 right-0 z-9999 bg-[#1e3a8a] text-white border-b border-white/10 transition-shadow duration-200 ${isScrolled ? 'shadow-[0_2px_12px_rgba(0,0,0,0.2)]' : ''}`}>
      <div className="max-w-full px-4 flex items-center justify-between gap-4 h-12">

        {/* Logo */}
        <button
          onClick={() => handleNavigation('dashboard', '/dashboard')}
          className="flex items-center bg-transparent border-none cursor-pointer font-extrabold text-xl tracking-widest p-0 gap-px shrink-0 focus-visible:outline-2 focus-visible:outline-[#93c5fd] focus-visible:outline-offset-2"
        >
          <h2 className="bg-linear-to-br from-white to-[#93c5fd] bg-clip-text text-transparent">
            {appName}
          </h2>
          <p className="bg-linear-to-br from-[#93c5fd] to-[#60a5fa] bg-clip-text text-transparent">
            .
          </p>
        </button>

        {/* Desktop Nav */}
        <div className={`flex-1 justify-center overflow-hidden transition-all duration-250 ease-in-out hidden lg:flex ${isNavVisible ? 'max-h-[60px] opacity-100 pointer-events-auto' : 'max-h-0 opacity-0 pointer-events-none flex-none'}`}>
          <ul className="flex gap-1 list-none m-0 p-0">
            {NAV_ITEMS.map(({ key, label, route }) => (
              <li key={key}>
                <button
                  onClick={() => handleNavigation(key, route)}
                  className={`bg-transparent border-none text-base font-semibold px-3 py-[0.4rem] relative cursor-pointer whitespace-nowrap transition-colors duration-150 flex flex-col items-center gap-[2px] focus-visible:outline-2 focus-visible:outline-[#93c5fd] focus-visible:outline-offset-2 ${isActive(key) ? 'text-white' : 'text-white/75 hover:text-white'}`}
                >
                  {label}
                  {isActive(key) && (
                    <span className="absolute -bottom-px left-0 right-0 h-[2px] bg-[#93c5fd]" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">

          {/* Toggle nav — desktop only */}
          <button
            className="relative hidden lg:flex items-center justify-center w-9 h-9 bg-white/8 border border-white/12 rounded text-white/85 cursor-pointer transition-colors duration-150 hover:bg-white/16 hover:text-white shrink-0 focus-visible:outline-2 focus-visible:outline-[#93c5fd] focus-visible:outline-offset-2"
            onClick={() => setIsNavVisible(v => !v)}
            title={isNavVisible ? 'Cacher le menu' : 'Afficher le menu'}
          >
            {isNavVisible
              ? <i className="bx bx-hide text-[18px]" />
              : <i className="bx bx-show text-[18px]" />}
          </button>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button
              className={`flex items-center gap-[6px] h-9 px-[5px] border rounded cursor-pointer transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[#93c5fd] focus-visible:outline-offset-2 ${isProfileOpen ? 'bg-white/16 text-white border-white/12' : 'bg-white/8 text-white/85 border-white/12 hover:bg-white/16 hover:text-white'}`}
              onClick={() => setIsProfileOpen(o => !o)}
            >
              <div className="w-[26px] h-[26px] bg-white/15 border border-white/25 rounded flex items-center justify-center shrink-0">
                <i className="bx bx-user text-[16px]" />
              </div>
              <i
                className={`bx bx-chevron-down text-[14px] transition-transform duration-200 opacity-70 ${isProfileOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isProfileOpen && (
              <div className="absolute top-[calc(100%+6px)] right-0 bg-white border border-[#e2e8f0] rounded shadow-[0_8px_24px_rgba(0,0,0,0.12)] z-10000 min-w-[280px] overflow-hidden text-[#1e293b]">
                {/* Profile header */}
                <div className="flex items-center gap-[10px] px-3 py-[14px] bg-[#f8fafc]">
                  <div className="w-9 h-9 bg-[#e2e8f0] border border-[#cbd5e1] rounded flex items-center justify-center text-[#475569] shrink-0">
                    <i className="bx bx-user-circle text-[32px]" />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-[#1e293b] m-0 mb-[2px] whitespace-nowrap overflow-hidden text-ellipsis">Admin</p>
                    <p className="text-[11px] text-[#64748b] m-0 whitespace-nowrap overflow-hidden text-ellipsis">admin</p>
                  </div>
                </div>

                <div className="h-px bg-[#e2e8f0]" />

                <ul className="list-none m-0 p-1">
                  <li>
                    <button
                      className="flex items-center gap-2 w-full px-[10px] py-2 bg-transparent border-none text-[13px] font-medium text-[#475569] cursor-pointer text-left transition-colors duration-120 hover:bg-[#f1f5f9] hover:text-[#1e293b] focus-visible:outline-2 focus-visible:outline-[#93c5fd] focus-visible:outline-offset-2"
                      onClick={() => { navigate('/profile'); setIsProfileOpen(false); }}
                    >
                      <i className="bx bx-user-circle text-[16px]" /><span>Mon Compte</span>
                    </button>
                  </li>
                  <li>
                    <button
                      className="flex items-center gap-2 w-full px-[10px] py-2 bg-transparent border-none text-[13px] font-medium text-[#475569] cursor-pointer text-left transition-colors duration-120 hover:bg-[#f1f5f9] hover:text-[#1e293b] focus-visible:outline-2 focus-visible:outline-[#93c5fd] focus-visible:outline-offset-2"
                      onClick={() => { navigate('/settings'); setIsProfileOpen(false); }}
                    >
                     <i className="bx bx-cog text-[16px]" /><span>Paramètres</span>
                    </button>
                  </li>
                </ul>

                <div className="h-px bg-[#e2e8f0]" />

                <div className="p-1">
                  <button
                    className="flex items-center gap-2 w-full px-[10px] py-2 bg-transparent border-none text-[13px] font-medium text-[#dc2626] cursor-pointer text-left transition-colors duration-120 hover:bg-[#fef2f2] hover:text-[#b91c1c] focus-visible:outline-2 focus-visible:outline-[#93c5fd] focus-visible:outline-offset-2"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <i className="bx bx-log-out text-[16px]" /><span>Déconnexion</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden relative flex items-center justify-center w-9 h-9 bg-white/8 border border-white/12 rounded text-white/85 cursor-pointer transition-colors duration-150 hover:bg-white/16 hover:text-white shrink-0 focus-visible:outline-2 focus-visible:outline-[#93c5fd] focus-visible:outline-offset-2"
            onClick={() => setIsMenuOpen(o => !o)}
          >
            {isMenuOpen 
            ? <i className="bx bx-x text-[20px]" /> 
            : <i className="bx bx-menu text-[20px]" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`fixed top-0 left-0 w-[280px] max-w-[85vw] h-dvh bg-white border-r border-[#e2e8f0] z-10001 flex flex-col transition-transform duration-250 ease-in-out overflow-y-auto lg:hidden ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-3 py-[14px] bg-[#f8fafc] border-b border-[#e2e8f0] shrink-0">
          <div className="flex items-center gap-[10px] text-[#1e293b]">
            <i className="bx bx-user-circle text-[36px]" />
            <p className="text-[13px] font-semibold text-[#1e293b] m-0">Admin</p>
          </div>
          <button
            className="flex items-center justify-center w-8 h-8 bg-transparent border border-[#e2e8f0] rounded text-[#475569] cursor-pointer shrink-0 hover:bg-[#f1f5f9] hover:text-[#1e293b]"
            onClick={() => setIsMenuOpen(false)}
          >
            <i className="bx bx-x text-[18px]" />
          </button>
        </div>

        <div className="h-px bg-[#e2e8f0]" />

        <ul className="list-none m-0 p-2 flex-1">
          {[...NAV_ITEMS, { key: 'ventes', label: 'Ventes', route: '/ventes' }].map(({ key, label, route }) => (
            <li key={key}>
              <button
                onClick={() => handleNavigation(key, route)}
                className={`relative flex items-center gap-2 w-full py-[10px] bg-transparent border-none text-[13px] font-medium cursor-pointer text-left transition-colors duration-120 focus-visible:outline-2 focus-visible:outline-[#93c5fd] focus-visible:outline-offset-2 ${isActive(key) ? 'bg-[#eff6ff] text-[#1e3a8a] font-semibold pl-5 pr-3 rounded' : 'px-3 text-[#475569] hover:bg-[#f1f5f9] hover:text-[#1e293b] rounded'}`}
              >
                {isActive(key) && (
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 w-[5px] h-[5px] bg-[#3b82f6] rounded-full shrink-0" />
                )}
                {label}
              </button>
            </li>
          ))}
        </ul>

        <div className="h-px bg-[#e2e8f0] mt-auto" />

        <div className="p-2 shrink-0">
          <button
            className="flex items-center justify-center gap-2 w-full px-[10px] py-2 bg-transparent border-none text-[13px] font-medium text-[#dc2626] cursor-pointer text-left transition-colors duration-120 hover:bg-[#fef2f2] hover:text-[#b91c1c] focus-visible:outline-2 focus-visible:outline-[#93c5fd] focus-visible:outline-offset-2"
            onClick={() => setIsMenuOpen(false)}
          >
            <i className="bx bx-log-out text-[16px]" /><span>Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-black/40 z-9998 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
          aria-label="Close menu"
        >
        </button>
      )}
    </nav>
  );
};

Header.propTypes = {
  activeSection: PropTypes.string,
  onNavigate: PropTypes.func,
};

export default Header;
