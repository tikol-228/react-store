import React, { useState } from "react";
import { Search, Sun, ShoppingBag, User, ChevronDown, Menu, X, Heart, Package, LogOut, Settings } from "lucide-react";
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';
import logo from '../icons/logo.jpeg'

const menu = [
  { name: "Главная", path: "/" },
  {
    name: "Бренды",
    path: "/#categories",
    children: [
      { name: "DIBI Milano", path: "/#products" },
      { name: "Germaine de Capuccini", path: "/#products" },
    ],
  },
  { name: "Профессиональный уход", path: "/#products" },
  { name: "Домашний уход", path: "/#products" },
  { name: "Оплата", path: "/#features" },
  { name: "Доставка", path: "/#features" },
  { name: "Возврат товара", path: "/#features" },
  { name: "Контакты", path: "/contacts" },
];

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const { favorites } = useFavorites();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    setOpenSubmenu(null);
  };

  const toggleSubmenu = (name: string) => {
    setOpenSubmenu(openSubmenu === name ? null : name);
  };

  return (
    <header className="w-full border-b border-gray-200 bg-white sticky top-0 z-50">
      {/* TOP */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 h-16 sm:h-20 flex items-center justify-between">
        {/* MOBILE MENU BUTTON */}
        <button 
          onClick={toggleMobileMenu}
          className="md:hidden p-2 hover:bg-gray-50 rounded-full transition-colors"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 sm:gap-3 flex-1 md:flex-none">
          <img src={logo} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center object-cover" alt="Logo"/>
          <span className="hidden sm:inline text-lg sm:text-xl font-bold text-[#1A1A1A] tracking-tight">
            Art Capital Estetic
          </span>
        </Link>

        {/* SEARCH - DESKTOP */}
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

        {/* ACTIONS */}
        <div className="flex items-center gap-2 sm:gap-4 text-gray-700">
          <button className="p-2 hover:bg-gray-50 rounded-full transition-colors hidden sm:block">
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
            >
              <div className="relative">
                <User size={20} className={user ? "text-[#1B4B43]" : "text-gray-500"} />
                {user && <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 border-2 border-white rounded-full"></span>}
              </div>
              {user && (
                <span className="text-sm font-medium text-gray-700 hidden lg:block group-hover:text-[#1B4B43]">
                  {user.name.split(' ')[0]}
                </span>
              )}
              <ChevronDown size={14} className={`text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* User Dropdown Menu */}
            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white shadow-xl rounded-xl border border-gray-100 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="font-bold text-[#1A1A1A]">{user?.name}</p>
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

      {/* SEARCH - MOBILE */}
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

      {/* DESKTOP NAV */}
      <nav className="w-full border-t border-gray-50 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-center gap-6 lg:gap-8 text-gray-500 overflow-x-auto">
          {menu.map((item) => (
            <div key={item.name} className="relative group whitespace-nowrap">
              <Link
                to={item.path || "/"}
                className="flex items-center gap-1 hover:text-[#1B4B43] transition-colors font-medium text-[12px] lg:text-[13px] uppercase tracking-wider py-1"
              >
                {item.name}
                {item.children && <ChevronDown size={14} />}
              </Link>

              {item.children && (
                <div className="absolute left-0 top-full pt-4 w-52 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="bg-white shadow-xl rounded-xl border border-gray-100 py-2 flex flex-col overflow-hidden">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        to={child.path || "/"}
                        className="px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#1B4B43] transition-colors"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-white border-t border-gray-100 py-4">
          <div className="max-w-7xl mx-auto px-3 space-y-1">
            {menu.map((item) => (
              <div key={item.name}>
                {item.children ? (
                  <>
                    <button
                      onClick={() => toggleSubmenu(item.name)}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors text-gray-700 font-medium text-sm"
                    >
                      {item.name}
                      <ChevronDown 
                        size={16} 
                        className={`transition-transform ${openSubmenu === item.name ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {openSubmenu === item.name && (
                      <div className="bg-gray-50 ml-4 border-l-2 border-[#1B4B43]">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            to={child.path || "/"}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-4 py-2.5 text-sm text-gray-600 hover:text-[#1B4B43] transition-colors"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.path || "/"}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors text-gray-700 font-medium text-sm"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
