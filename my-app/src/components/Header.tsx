import React from "react";
import { Search, Sun, ShoppingBag, User, ChevronDown } from "lucide-react";
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import logo from '../icons/logo.jpeg'

const menu = [
  { name: "Главная", path: "/" },
  {
    name: "Бренды",
    children: [
      { name: "DIBI Milano" },
      { name: "Germaine de Capuccini" },
    ],
  },
  { name: "Профессиональный уход" },
  { name: "Домашний уход" },
  { name: "Оплата" },
  { name: "Доставка" },
  { name: "Возврат товара" },
  { name: "Контакты" },
];

const Header: React.FC = () => {
  const { user } = useAuth();
  const { totalItems } = useCart();

  return (
    <header className="w-full border-b border-gray-200 bg-white sticky top-0 z-50">
      {/* TOP */}
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} className="w-12 h-12 rounded-full flex items-center object-cover" alt="Logo"/>
          <span className="text-xl font-bold text-[#1A1A1A] tracking-tight">
            Art Capital Estetic
          </span>
        </Link>

        {/* SEARCH */}
        <div className="relative w-[450px] max-lg:w-[250px] hidden md:block">
          <input
            type="text"
            placeholder="Поиск товаров..."
            className="w-full rounded-full bg-gray-50 border border-gray-100 py-2.5 pl-4 pr-10 outline-none focus:bg-white focus:ring-2 focus:ring-[#1B4B43]/10 focus:border-[#1B4B43] transition-all"
          />
          <Search
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-4 text-gray-700">
          <button className="p-2 hover:bg-gray-50 rounded-full transition-colors">
            <Sun size={20} className="text-gray-500" />
          </button>
          
          <Link to="/cart" className="p-2 hover:bg-gray-50 rounded-full transition-colors relative group">
            <ShoppingBag size={20} className="text-gray-500 group-hover:text-[#1B4B43]" />
            {totalItems > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#1B4B43] text-white text-[10px] flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
          </Link>
          
          <Link 
            to={user ? "/profile" : "/login"} 
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
          </Link>
        </div>
      </div>

      {/* NAV */}
      <nav className="w-full border-t border-gray-50 hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-center gap-8 text-gray-500">
          {menu.map((item) => (
            <div key={item.name} className="relative group">
              <Link
                to={item.path || "#"}
                className="flex items-center gap-1 hover:text-[#1B4B43] transition-colors font-medium text-[13px] uppercase tracking-wider"
              >
                {item.name}
                {item.children && <ChevronDown size={14} />}
              </Link>

              {item.children && (
                <div className="absolute left-0 top-full pt-4 w-52 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="bg-white shadow-xl rounded-xl border border-gray-100 py-2 flex flex-col overflow-hidden">
                    {item.children.map((child) => (
                      <a
                        key={child.name}
                        href="#"
                        className="px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#1B4B43] transition-colors"
                      >
                        {child.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Header;