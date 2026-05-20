export const STORE_CATEGORY_NAMES = [
  'Уход за лицом',
  'Уход за телом',
  'Сыворотки',
  'Маски для лица',
  'Лосьоны для тела',
  'Скрабы для тела',
  'Наборы',
];

export const LEGACY_CATEGORY_NAMES = [
  'Books',
  'Clothing',
  'Electronics',
  'Home & Garden',
];

export function isAllowedCategoryName(name) {
  return STORE_CATEGORY_NAMES.includes(name);
}
