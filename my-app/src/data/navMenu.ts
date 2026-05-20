import { STORE_CATEGORY_NAMES } from './storeCategories';
import { brandNavItems, categoryNavDescriptions } from './storeBrands';

export type NavCategoryChild = {
  name: string;
  section: string;
  description: string;
  /** Фильтр каталога по категории товара */
  category?: string;
  /** Фильтр каталога по бренду (категория-бренд в БД) */
  brand?: string;
};

export type NavScrollItem = {
  name: string;
  section: string;
  category?: string;
  /** Подпись кнопки «показать всё» в выпадающем меню */
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

const categoryChildren: NavCategoryChild[] = STORE_CATEGORY_NAMES.map((name) => ({
  name,
  section: 'products',
  category: name,
  description: categoryNavDescriptions[name] || name,
}));

const brandChildren: NavCategoryChild[] = brandNavItems.map((b) => ({
  name: b.name,
  section: 'products',
  brand: b.name,
  description: b.description,
}));

export const navMenu: NavItem[] = [
  { name: 'Главная', section: 'top' },
  {
    name: 'Категории',
    section: 'categories',
    allLabel: 'Все категории',
    children: categoryChildren,
  },
  {
    name: 'Бренды',
    section: 'products',
    allLabel: 'Все бренды',
    children: brandChildren,
  },
  { name: 'Профессиональный уход', section: 'about' },
  { name: 'Оплата', path: '/payment' },
  { name: 'Доставка', path: '/delivery' },
  { name: 'Возврат товара', path: '/returns' },
  { name: 'Контакты', path: '/contacts' },
];
