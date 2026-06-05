import { categoryNavDescriptions } from './storeBrands';
import type { ProductCareType } from './productCareTypes';

export type NavCategoryChild = {
  name: string;
  section: string;
  description: string;
  /** Фильтр каталога по категории товара (имя в БД) */
  category?: string;
  /** Фильтр каталога по бренду */
  brand?: string;
};

export type NavScrollItem = {
  name: string;
  section: string;
  category?: string;
  /** Фильтр: домашний или профессиональный уход */
  careType?: ProductCareType;
  allLabel?: string;
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

const categoryChildren: NavCategoryChild[] = [
  {
    name: 'Уход за лицом',
    section: 'products',
    category: 'Уход за лицом',
    description: categoryNavDescriptions['Уход за лицом'],
  },
  {
    name: 'Уход за телом',
    section: 'products',
    category: 'Уход за телом',
    description: categoryNavDescriptions['Уход за телом'],
  },
  {
    name: 'Средства SPF',
    section: 'products',
    category: 'Средства SPF',
    description: categoryNavDescriptions['Средства SPF'],
  },
  {
    name: 'Наборы 🔥',
    section: 'products',
    category: 'Наборы',
    description: categoryNavDescriptions['Наборы'],
  },
];

export const navMenu: NavItem[] = [
  { name: 'Главная', section: 'top' },
  {
    name: 'Категории',
    section: 'products',
    allLabel: 'Все категории',
    children: categoryChildren,
  },
  { name: 'Профессиональный уход', section: 'products', careType: 'professional' },
  { name: 'Домашний уход', section: 'products', careType: 'home' },
  { name: 'Оплата', path: '/payment' },
  { name: 'Доставка', path: '/delivery' },
  { name: 'Контакты', path: '/contacts' },
];
