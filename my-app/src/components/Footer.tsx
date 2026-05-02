import React from "react";
import { Link } from "react-router-dom";
import { companyInfo } from "../data/company";

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white text-black mt-12 sm:mt-20">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-8 sm:py-16 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-10">

        {/* О нас */}
        <div>
          <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">О нас</h3>
          <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-black/70">
            <li>О компании</li>
            <li>Карьера</li>
            <li>Наш блог</li>
            <li>Стать партнёром</li>
          </ul>
        </div>

        {/* Настройки */}
        <div>
          <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Настройки</h3>
          <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-black/70">
            <li>Ваш аккаунт</li>
            <li>Отслеживание заказа</li>
            <li>Центр помощи</li>
            <li>Частые вопросы</li>
            <li><Link to="/admin" className="hover:text-black">Админ-панель</Link></li>
          </ul>
        </div>

        {/* Для клиентов */}
        <div>
          <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Для клиентов</h3>
          <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-black/70">
            <li>Как купить</li>
            <li>Оплата</li>
            <li>Доставка</li>
            <li>Информация о доставке</li>
            <li className="hidden sm:block">Налоги и сборы</li>
          </ul>
        </div>

        {/* Политики */}
        <div>
          <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Политики</h3>
          <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-black/70">
            <li>Политика конфиденциальности</li>
            <li>Условия использования</li>
            <li>Возврат и компенсации</li>
            <li className="hidden sm:block">Возвраты и замены</li>
            <li className="hidden sm:block">Гарантия</li>
          </ul>
        </div>

        {/* Контакты */}
        <div>
          <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Контакты</h3>
          <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-black/70">
            <li className="font-semibold text-black/90">{companyInfo.name}</li>
            <li>
              <a href={`tel:${companyInfo.phone}`} className="hover:text-black transition-colors">
                {companyInfo.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${companyInfo.emails.primary}`} className="hover:text-black text-[10px] sm:text-xs transition-colors break-all">
                {companyInfo.emails.primary}
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* нижняя панель с информацией о компании */}
      <div className="border-t border-black/10 mt-6 sm:mt-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8">
          {/* Основная информация */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {/* Адрес */}
            <div className="text-xs sm:text-sm text-black/70">
              <p className="font-semibold text-black mb-1 sm:mb-2">Адрес:</p>
              <p className="text-xs sm:text-sm">{companyInfo.address.city}</p>
              <p className="text-xs sm:text-sm">{companyInfo.address.street}</p>
              <p className="text-xs sm:text-sm">{companyInfo.address.floor}</p>
            </div>

            {/* Время работы */}
            <div className="text-xs sm:text-sm text-black/70">
              <p className="font-semibold text-black mb-1 sm:mb-2">Время работы:</p>
              <p className="text-xs sm:text-sm">{companyInfo.workingHours.weekday}</p>
              <p className="text-xs sm:text-sm">{companyInfo.workingHours.saturday}</p>
              <p>{companyInfo.workingHours.sunday}</p>
            </div>

            {/* Банковские реквизиты */}
            <div className="text-sm text-black/70">
              <p className="font-semibold text-black mb-2">Банковские реквизиты:</p>
              <p>{companyInfo.bankDetails.bank}</p>
              <p className="break-all">{companyInfo.bankDetails.accountNumber}</p>
              <p>BIC: {companyInfo.bankDetails.bic}</p>
              <p className="mt-2 text-xs">УНП {companyInfo.taxNumber}</p>
            </div>
          </div>

          {/* Нижняя строка с копирайтом */}
          <div className="border-t border-black/10 pt-6 text-sm text-black/60 flex flex-col md:flex-row items-center justify-between gap-2">
            <p>© Все права защищены.</p>
            <p>Сделано Tikol</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;