export const STORE_BRAND_NAMES = ['DIBI Milano', 'Germaine de Capuccini'] as const;

export type StoreBrandName = (typeof STORE_BRAND_NAMES)[number];

export function isStoreBrandName(name: string): name is StoreBrandName {
  return (STORE_BRAND_NAMES as readonly string[]).includes(name);
}

export function filterStoreBrands<T extends { id: number; name: string }>(brands: T[]): T[] {
  const byName = new Map<string, T>();
  for (const b of brands) {
    if (!isStoreBrandName(b.name)) continue;
    if (!byName.has(b.name)) byName.set(b.name, b);
  }
  return STORE_BRAND_NAMES.map((name) => byName.get(name)).filter((b): b is T => Boolean(b));
}

export const brandNavItems: { name: StoreBrandName; description: string }[] = [
  {
    name: 'DIBI Milano',
    description: 'Профессиональная косметика для лица и тела',
  },
  {
    name: 'Germaine de Capuccini',
    description: 'Премиальный уход и anti-age программы',
  },
];

export const categoryNavDescriptions: Record<string, string> = {
  'Уход за лицом': 'Кремы, сыворотки и уход за кожей лица',
  'Уход за телом': 'Лосьоны, скрабы и питание кожи тела',
  Сыворотки: 'Активные концентраты для лица',
  'Маски для лица': 'Питательные и очищающие маски',
  'Лосьоны для тела': 'Увлажняющие лосьоны для тела',
  'Скрабы для тела': 'Отшелушивающие скрабы для тела',
  Наборы: 'Готовые наборы косметики',
};
