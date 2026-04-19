import React from "react";
import { Search, Sun, ShoppingBag, User, ChevronDown } from "lucide-react";
import logo from '../icons/logo.jpeg'

const menu = [
  { name: "Главная" },
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
  return (
    <header className="w-full border-b border-gray-200 bg-white">
      {/* TOP */}
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        {/* LOGO */}
        <div className="flex items-center gap-3">
          <img src={logo} className="w-16 h-16 rounded-full flex items-center"/>
          <span className="text-xl font-semibold text-gray-800">
            Art Capital Estetic
          </span>
        </div>

        {/* SEARCH */}
        <div className="relative w-[500px] max-lg:w-[300px] hidden sm:block">
          <input
            type="text"
            placeholder="Поиск среди более чем 50 000 товаров"
            className="w-full rounded-full bg-gray-100 py-3 pl-4 pr-10 outline-none focus:ring-2 focus:ring-[#0f3d2e]/20"
          />
          <Search
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-5 text-gray-700">
          <button className="hover:text-[#0f3d2e] transition">
            <Sun size={20} />
          </button>
          <button className="hover:text-[#0f3d2e] transition">
            <ShoppingBag size={20} />
          </button>
          <button className="hover:text-[#0f3d2e] transition">
            <User size={20} />
          </button>
        </div>
      </div>

      {/* NAV */}
      <nav className="w-full">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-center gap-10 text-gray-600">
          {menu.map((item) => (
            <div key={item.name} className="relative group">
              {/* LINK */}
              <a
                href="#"
                className="flex items-center gap-1 hover:text-[#0f3d2e] transition font-medium"
              >
                {item.name}
                {item.children && <ChevronDown size={16} />}
              </a>

              {/* DROPDOWN */}
              {item.children && (
                <div className="absolute left-0 top-full mt-2 w-52 bg-white shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="flex flex-col py-2">
                    {item.children.map((child) => (
                      <a
                        key={child.name}
                        href="#"
                        className="px-4 py-2 hover:bg-gray-100 transition"
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