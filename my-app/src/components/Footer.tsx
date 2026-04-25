import React from "react";
import { Link } from "react-router-dom";
import { companyInfo } from "../data/company";

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white text-black mt-20">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">

        {/* О нас */}
        <div>
          <h3 className="font-semibold mb-4">О нас</h3>
          <ul className="space-y-2 text-sm text-black/70">
            <li>О компании</li>
            <li>Карьера</li>
            <li>Наш блог</li>
            <li>Стать партнёром</li>
          </ul>
        </div>

        {/* Настройки */}
        <div>
          <h3 className="font-semibold mb-4">Настройки</h3>
          <ul className="space-y-2 text-sm text-black/70">
            <li>Ваш аккаунт</li>
            <li>Отслеживание заказа</li>
            <li>Центр помощи</li>
            <li>Частые вопросы</li>
            <li><Link to="/admin" className="hover:text-black">Админ-панель</Link></li>
          </ul>
        </div>

        {/* Для клиентов */}
        <div>
          <h3 className="font-semibold mb-4">Для клиентов</h3>
          <ul className="space-y-2 text-sm text-black/70">
            <li>Как купить</li>
            <li>Оплата</li>
            <li>Доставка</li>
            <li>Информация о доставке</li>
            <li>Налоги и сборы</li>
          </ul>
        </div>

        {/* Политики */}
        <div>
          <h3 className="font-semibold mb-4">Политики</h3>
          <ul className="space-y-2 text-sm text-black/70">
            <li>Политика конфиденциальности</li>
            <li>Условия использования</li>
            <li>Возврат и компенсации</li>
            <li>Возвраты и замены</li>
            <li>Возврат товара</li>
            <li>Гарантия</li>
          </ul>
        </div>

        {/* Контакты */}
        <div>
          <h3 className="font-semibold mb-4">Контакты</h3>
          <ul className="space-y-2 text-sm text-black/70">
            <li className="font-semibold text-black/90">{companyInfo.name}</li>
            <li>
              <a href={`tel:${companyInfo.phone}`} className="hover:text-black">
                {companyInfo.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${companyInfo.emails.primary}`} className="hover:text-black text-xs">
                {companyInfo.emails.primary}
              </a>
            </li>
            <li>
              <a href={`mailto:${companyInfo.emails.secondary}`} className="hover:text-black text-xs">
                {companyInfo.emails.secondary}
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* нижняя панель с информацией о компании */}
      <div className="border-t border-black/10 mt-10">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Основная информация */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Адрес */}
            <div className="text-sm text-black/70">
              <p className="font-semibold text-black mb-2">Адрес:</p>
              <p>{companyInfo.address.city}</p>
              <p>{companyInfo.address.street}</p>
              <p>{companyInfo.address.floor}</p>
            </div>

            {/* Время работы */}
            <div className="text-sm text-black/70">
              <p className="font-semibold text-black mb-2">Время работы:</p>
              <p>{companyInfo.workingHours.weekday}</p>
              <p>{companyInfo.workingHours.saturday}</p>
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