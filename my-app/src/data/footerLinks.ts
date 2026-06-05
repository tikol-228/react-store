export type FooterLinkItem =
  | { label: string; type: 'route'; to: string }
  | { label: string; type: 'scroll'; section: string; category?: string }
  | { label: string; type: 'external'; href: string };

export const footerLegalLinks: FooterLinkItem[] = [
  { label: 'Политика конфиденциальности', type: 'route', to: '/info/privacy' },
  { label: 'Условия использования', type: 'route', to: '/info/terms' },
];

export const footerClientLinks: FooterLinkItem[] = [
  { label: 'Оплата', type: 'route', to: '/payment' },
  { label: 'Доставка', type: 'route', to: '/delivery' },
  { label: 'Возврат товара', type: 'route', to: '/returns' },
  { label: 'Контакты', type: 'route', to: '/contacts' },
  { label: 'Банковские реквизиты', type: 'route', to: '/contacts#requisites' },
];
