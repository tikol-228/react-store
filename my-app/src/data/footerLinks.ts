export type FooterLinkItem =
  | { label: string; type: 'route'; to: string }
  | { label: string; type: 'scroll'; section: string; category?: string }
  | { label: string; type: 'external'; href: string };

export type FooterSection = {
  title: string;
  links: FooterLinkItem[];
};

export const footerSections: FooterSection[] = [
  {
    title: 'О нас',
    links: [
      { label: 'О компании', type: 'scroll', section: 'about' },
      { label: 'Карьера', type: 'route', to: '/contacts' },
      { label: 'Наш блог', type: 'route', to: '/contacts' },
      { label: 'Стать партнёром', type: 'route', to: '/contacts' },
    ],
  },
  {
    title: 'Настройки',
    links: [
      { label: 'Ваш аккаунт', type: 'route', to: '/profile' },
      { label: 'Отслеживание заказа', type: 'route', to: '/orders' },
      { label: 'Центр помощи', type: 'route', to: '/info/help' },
      { label: 'Частые вопросы', type: 'route', to: '/info/faq' },
      { label: 'Панель администратора', type: 'route', to: '/admin' },
    ],
  },
  {
    title: 'Для клиентов',
    links: [
      { label: 'Как купить', type: 'route', to: '/info/how-to-buy' },
      { label: 'Оплата', type: 'route', to: '/payment' },
      { label: 'Доставка', type: 'route', to: '/delivery' },
      { label: 'Информация о доставке', type: 'route', to: '/delivery' },
      { label: 'Налоги и сборы', type: 'route', to: '/info/taxes' },
    ],
  },
  {
    title: 'Политики',
    links: [
      { label: 'Политика конфиденциальности', type: 'route', to: '/info/privacy' },
      { label: 'Условия использования', type: 'route', to: '/info/terms' },
      { label: 'Возврат и компенсации', type: 'route', to: '/returns' },
      { label: 'Возвраты и замены', type: 'route', to: '/returns' },
      { label: 'Гарантия', type: 'route', to: '/returns' },
    ],
  },
];
