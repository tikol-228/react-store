export type NavCategoryChild = {
  name: string;
  section: string;
  image: string;
  description: string;
};

export type NavScrollItem = {
  name: string;
  section: string;
  children?: NavCategoryChild[];
};

export type NavLinkItem = {
  name: string;
  path: string;
};

export type NavItem = NavScrollItem | NavLinkItem;

export function isNavLink(item: NavItem): item is NavLinkItem {
  return 'path' in item;
}

export const navMenu: NavItem[] = [
  { name: 'Главная', section: 'top' },
  {
    name: 'Категории',
    section: 'categories',
    children: [
      {
        name: 'DIBI Milano',
        section: 'products',
        image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=400',
        description: 'Профессиональная косметика для лица и тела',
      },
      {
        name: 'Germaine de Capuccini',
        section: 'products',
        image: 'https://images.unsplash.com/photo-1612817288484-6f91600611a2?auto=format&fit=crop&q=80&w=400',
        description: 'Премиальный уход и anti-age программы',
      },
    ],
  },
  { name: 'Профессиональный уход', section: 'about' },
  { name: 'Домашний уход', section: 'products' },
  { name: 'Оплата', path: '/payment' },
  { name: 'Доставка', path: '/delivery' },
  { name: 'Возврат товара', path: '/returns' },
  { name: 'Контакты', path: '/contacts' },
];
