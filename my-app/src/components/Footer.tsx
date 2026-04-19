import React from "react";

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

        {/* Аккаунт */}
        <div>
          <h3 className="font-semibold mb-4">Аккаунт</h3>
          <ul className="space-y-2 text-sm text-black/70">
            <li>Связаться с нами</li>
            <li>Лицензии</li>
            <li>Подарочные карты</li>
          </ul>
        </div>

      </div>

      {/* нижняя панель */}
      <div className="border-t border-black/10 mt-10">
        <div className="max-w-7xl mx-auto px-6 py-6 text-sm text-black/60 flex flex-col md:flex-row items-center justify-between gap-2">
          <p>© Все права защищены.</p>
          <p>Сделано Tikol</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;