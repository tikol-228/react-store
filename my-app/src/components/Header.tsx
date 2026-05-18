import React, { useEffect, useState } from "react";
import { Search, Sun, ShoppingBag, User, ChevronDown, Menu, X, Heart, Package, LogOut, Settings } from "lucide-react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { navMenu, isNavLink } from '../data/navMenu';
import { scrollToSection } from '../utils/scrollToSection';
import logo from '../icons/logo.jpeg'

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const { favorites } = useFavorites();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const closeMenus = () => {
    setMobileMenuOpen(false);
    setOpenSubmenu(null);
    setOpenDropdown(null);
  };

  const goToSection = (section: string) => {
    closeMenus();

    if (location.pathname === '/') {
      scrollToSection(section);
      window.history.replaceState(null, '', `#${section}`);
      return;
    }

    navigate(`/#${section}`);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    setOpenSubmenu(null);
  };

  const toggleSubmenu = (name: string) => {
    setOpenSubmenu(openSubmenu === name ? null : name);
  };

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinkClass =
    'flex items-center gap-1 hover:text-[#1B4B43] transition-colors font-medium text-[12px] lg:text-[13px] uppercase tracking-wider py-1';
  const mobileLinkClass =
    'block w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors text-gray-700 font-medium text-sm';

  return (
    <header className={`w-full sticky top-0 z-50 overflow-visible transition-all duration-300 ${scrolled ? 'border-b border-gray-200 bg-white shadow-sm' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 h-16 sm:h-20 flex items-center justify-between">
        <button 
          onClick={toggleMobileMenu}
          className="md:hidden p-2 hover:bg-gray-50 rounded-full transition-colors"
          type="button"
          aria-label={mobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <Link to="/" onClick={() => location.pathname === '/' && goToSection('top')} className="flex items-center gap-2 sm:gap-3 flex-1 md:flex-none">
          <img src={logo} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center object-cover" alt="Logo"/>
          <span className="hidden sm:inline text-lg sm:text-xl font-bold text-[#1A1A1A] tracking-tight">
            Art Capital Estetic
          </span>
        </Link>

        <div className="relative w-[300px] lg:w-[450px] hidden lg:block">
          <input
            type="text"
            placeholder="Поиск товаров..."
            className="w-full rounded-full bg-gray-50 border border-gray-100 py-2.5 pl-4 pr-10 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[#1B4B43]/10 focus:border-[#1B4B43] transition-all"
          />
          <Search
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>

        <div className="flex items-center gap-2 sm:gap-4 text-gray-700">
          <button className="p-2 hover:bg-gray-50 rounded-full transition-colors hidden sm:block" type="button">
            <Sun size={20} className="text-gray-500" />
          </button>
          
          <Link to="/favorites" className="p-2 hover:bg-gray-50 rounded-full transition-colors relative group">
            <Heart size={20} className="text-gray-500 group-hover:text-red-500" />
            {favorites.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                {favorites.length > 9 ? '9+' : favorites.length}
              </span>
            )}
          </Link>
          
          <Link to="/cart" className="p-2 hover:bg-gray-50 rounded-full transition-colors relative group">
            <ShoppingBag size={20} className="text-gray-500 group-hover:text-[#1B4B43]" />
            {totalItems > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#1B4B43] text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </Link>
          
          <div className="relative">
            <button 
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-full transition-colors group"
              type="button"
            >
              <div className="relative">
                <User size={20} className={user ? "text-[#1B4B43]" : "text-gray-500"} />
                {user && <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 border-2 border-white rounded-full"></span>}
              </div>
              {user && (
                <span className="text-sm font-medium text-gray-700 hidden lg:block group-hover:text-[#1B4B43]">
                  {user.first_name}
                </span>
              )}
              <ChevronDown size={14} className={`text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white shadow-xl rounded-xl border border-gray-100 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="font-bold text-[#1A1A1A]">
                    {user ? `${user.first_name} ${user.last_name}`.trim() : ''}
                  </p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
                
                <div className="py-1">
                  <Link
                    to="/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#1B4B43] transition-colors"
                  >
                    <Settings size={16} />
                    Профиль
                  </Link>
                  
                  <Link
                    to="/orders"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#1B4B43] transition-colors"
                  >
                    <Package size={16} />
                    Мои заказы
                  </Link>
                  
                  <Link
                    to="/favorites"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#1B4B43] transition-colors"
                  >
                    <Heart size={16} />
                    Избранное ({favorites.length})
                  </Link>
                </div>
                
                <div className="border-t border-gray-100 pt-1">
                  <button
                    onClick={() => {
                      logout();
                      setUserMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors w-full text-left"
                    type="button"
                  >
                    <LogOut size={16} />
                    Выйти
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="block lg:hidden px-3 pb-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Поиск..."
            className="w-full rounded-full bg-gray-50 border border-gray-100 py-2 pl-4 pr-10 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[#1B4B43]/10 focus:border-[#1B4B43] transition-all"
          />
          <Search
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>
      </div>

      <nav className="w-full border-t border-gray-50 hidden md:block overflow-visible">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-center gap-6 lg:gap-8 text-gray-500 overflow-visible">
          {navMenu.map((item) => (
            <div
              key={item.name}
              className="relative whitespace-nowrap"
              onMouseEnter={() => 'children' in item && item.children && setOpenDropdown(item.name)}
              onMouseLeave={() => 'children' in item && item.children && setOpenDropdown(null)}
            >
              {isNavLink(item) ? (
                <Link to={item.path} className={navLinkClass} onClick={closeMenus}>
                  {item.name}
                </Link>
              ) : item.children ? (
                <>
                  <button
                    type="button"
                    onClick={() => toggleDropdown(item.name)}
                    className={navLinkClass}
                    aria-expanded={openDropdown === item.name}
                  >
                    {item.name}
                    <ChevronDown size={14} className={`${openDropdown === item.name ? 'rotate-180' : ''} transition-transform duration-200`} />
                  </button>
                  {openDropdown === item.name && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 z-[100]">
                      <div className="w-[min(100vw-2rem,22rem)] rounded-2xl border border-gray-200 bg-white p-2 shadow-2xl ring-1 ring-black/5">
                        <button
                          type="button"
                          onClick={() => goToSection(item.section)}
                          className="mb-1 w-full rounded-xl px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-[#1B4B43] hover:bg-[#1B4B43]/5 transition-colors"
                        >
                          Все категории
                        </button>
                        <div className="flex flex-col gap-2">
                          {item.children.map((child) => (
                            <button
                              key={child.name}
                              type="button"
                              onClick={() => goToSection(child.section)}
                              className="group flex w-full items-center gap-3 rounded-xl border border-gray-100 bg-white p-2 text-left transition-all hover:border-[#1B4B43]/30 hover:bg-gray-50 hover:shadow-md"
                            >
                              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                                <img
                                  src={child.image}
                                  alt={child.name}
                                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-[#1A1A1A] group-hover:text-[#1B4B43]">
                                  {child.name}
                                </p>
                                <p className="mt-0.5 text-xs leading-snug text-gray-500">
                                  {child.description}
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <button type="button" onClick={() => goToSection(item.section)} className={navLinkClass}>
                  {item.name}
                </button>
              )}
            </div>
          ))}
        </div>
      </nav>

      <nav className={`md:hidden bg-white border-t border-gray-100 overflow-hidden transition-[max-height,opacity] duration-300 ${mobileMenuOpen ? 'max-h-[1200px] opacity-100 py-4' : 'max-h-0 opacity-0 py-0'}`}>
        <div className={`max-w-7xl mx-auto px-3 space-y-1 transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}>
          {navMenu.map((item) => (
            <div key={item.name}>
              {isNavLink(item) ? (
                <Link to={item.path} onClick={closeMenus} className={mobileLinkClass}>
                  {item.name}
                </Link>
              ) : item.children ? (
                <>
                  <button
                    type="button"
                    onClick={() => toggleSubmenu(item.name)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors text-gray-700 font-medium text-sm"
                  >
                    {item.name}
                    <ChevronDown 
                      size={16} 
                      className={`transition-transform duration-300 ${openSubmenu === item.name ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <div className={`overflow-hidden transition-[max-height] duration-300 ${openSubmenu === item.name ? 'max-h-[520px]' : 'max-h-0'}`}>
                    <div className="ml-3 space-y-2 border-l-2 border-[#1B4B43] bg-white py-2 pl-3 pr-1">
                      <button
                        type="button"
                        onClick={() => goToSection(item.section)}
                        className="block w-full rounded-lg px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-[#1B4B43] hover:bg-[#1B4B43]/5"
                      >
                        Все категории
                      </button>
                      {item.children.map((child) => (
                        <button
                          key={child.name}
                          type="button"
                          onClick={() => goToSection(child.section)}
                          className="group flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-white p-2 text-left shadow-sm"
                        >
                          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                            <img src={child.image} alt={child.name} className="h-full w-full object-cover" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-[#1A1A1A]">{child.name}</p>
                            <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">{child.description}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <button type="button" onClick={() => goToSection(item.section)} className={mobileLinkClass}>
                  {item.name}
                </button>
              )}
            </div>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Header;
