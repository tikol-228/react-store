/** Категории магазина (косметика). Остальное из БД не показываем. */
export const STORE_CATEGORY_NAMES = [
  'Уход за лицом',
  'Уход за телом',
  'Сыворотки',
  'Маски для лица',
  'Лосьоны для тела',
  'Скрабы для тела',
  'Наборы',
] as const;

export const LEGACY_CATEGORY_NAMES = [
  'Books',
  'Clothing',
  'Electronics',
  'Home & Garden',
] as const;

export type StoreCategoryName = (typeof STORE_CATEGORY_NAMES)[number];

export function isStoreCategoryName(name: string): name is StoreCategoryName {
  return (STORE_CATEGORY_NAMES as readonly string[]).includes(name);
}

export function filterStoreCategories<T extends { id: number; name: string }>(
  categories: T[]
): T[] {
  const byName = new Map<string, T>();
  for (const c of categories) {
    if ((LEGACY_CATEGORY_NAMES as readonly string[]).includes(c.name)) continue;
    if (!isStoreCategoryName(c.name)) continue;
    if (!byName.has(c.name)) byName.set(c.name, c);
  }
  return STORE_CATEGORY_NAMES.map((name) => byName.get(name)).filter(
    (c): c is T => Boolean(c)
  );
}
