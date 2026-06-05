export const PRODUCT_SKIN_TYPES = [
  'all_types',
  'normal',
  'sensitive',
  'combination',
  'oily',
  'dry',
  'problematic',
  'mature',
  'acne',
] as const;

export type ProductSkinType = (typeof PRODUCT_SKIN_TYPES)[number];

export const SKIN_TYPE_OPTIONS: { value: ProductSkinType; label: string }[] = [
  { value: 'all_types', label: 'для всех типов кожи' },
  { value: 'normal', label: 'нормальная' },
  { value: 'sensitive', label: 'чувствительная' },
  { value: 'combination', label: 'комбинированная' },
  { value: 'oily', label: 'жирная' },
  { value: 'dry', label: 'сухая' },
  { value: 'problematic', label: 'проблемная' },
  { value: 'mature', label: 'возрастная' },
  { value: 'acne', label: 'для всех типов с высыпаниями' },
];

export function isProductSkinType(value: string): value is ProductSkinType {
  return (PRODUCT_SKIN_TYPES as readonly string[]).includes(value);
}

/** Разбор значения из БД: одно значение, CSV или JSON-массив */
export function parseSkinTypes(value: string | null | undefined): ProductSkinType[] {
  if (!value?.trim()) return [];

  const trimmed = value.trim();
  if (trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed) as unknown;
      if (Array.isArray(parsed)) {
        return parsed.filter((item): item is ProductSkinType => typeof item === 'string' && isProductSkinType(item));
      }
    } catch {
      /* fallback to CSV */
    }
  }

  return trimmed
    .split(',')
    .map((part) => part.trim())
    .filter(isProductSkinType);
}

export function serializeSkinTypes(types: ProductSkinType[]): string {
  const valid = types.filter((t) => isProductSkinType(t));
  return valid.length ? JSON.stringify(valid) : '';
}

export function productHasSkinType(
  stored: string | null | undefined,
  type: ProductSkinType
): boolean {
  const types = parseSkinTypes(stored);
  if (!types.length) return false;
  if (types.includes('all_types')) return true;
  if (type === 'all_types') return true;
  return types.includes(type);
}

export function skinTypesLabel(value: string | null | undefined): string {
  const types = parseSkinTypes(value);
  if (!types.length) return '—';
  return types
    .map((t) => SKIN_TYPE_OPTIONS.find((o) => o.value === t)?.label ?? t)
    .join(', ');
}

/** @deprecated используйте skinTypesLabel */
export function skinTypeLabel(value: string | null | undefined): string {
  return skinTypesLabel(value);
}
