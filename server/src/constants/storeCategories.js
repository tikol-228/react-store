export const STORE_CATEGORY_NAMES = [
  'Уход за лицом',
  'Уход за телом',
  'Средства SPF',
  'Наборы',
];

export const LEGACY_CATEGORY_NAMES = [
  'Books',
  'Clothing',
  'Electronics',
  'Home & Garden',
  'Сыворотки',
  'Маски для лица',
  'Лосьоны для тела',
  'Скрабы для тела',
];

export function isAllowedCategoryName(name) {
  return STORE_CATEGORY_NAMES.includes(name);
}
