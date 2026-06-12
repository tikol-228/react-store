export const PRODUCT_CARE_TYPES = ['home', 'professional'] as const;

export type ProductCareType = (typeof PRODUCT_CARE_TYPES)[number];

export const CARE_TYPE_OPTIONS: { value: ProductCareType; label: string }[] = [
  { value: 'home', label: 'Домашний уход' },
  { value: 'professional', label: 'Профессиональный' },
];

export function isProductCareType(value: string): value is ProductCareType {
  return (PRODUCT_CARE_TYPES as readonly string[]).includes(value);
}

/** Разбор значения из БД: одно значение, CSV или JSON-массив */
export function parseCareTypes(value: string | null | undefined): ProductCareType[] {
  if (!value?.trim()) return [];

  const trimmed = value.trim();
  if (trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed) as unknown;
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (item): item is ProductCareType => typeof item === 'string' && isProductCareType(item)
        );
      }
    } catch {
      /* fallback to CSV */
    }
  }

  return trimmed
    .split(',')
    .map((part) => part.trim())
    .filter(isProductCareType);
}

export function serializeCareTypes(types: ProductCareType[]): string {
  const valid = types.filter((t) => isProductCareType(t));
  return valid.length ? JSON.stringify(valid) : '';
}

export function productHasCareType(
  stored: string | null | undefined,
  type: ProductCareType
): boolean {
  return parseCareTypes(stored).includes(type);
}

export function careTypesLabel(value: string | null | undefined): string {
  const types = parseCareTypes(value);
  if (!types.length) return '—';
  return types
    .map((t) => CARE_TYPE_OPTIONS.find((o) => o.value === t)?.label ?? t)
    .join(', ');
}

export function careTypeLabel(value: string | null | undefined): string {
  const types = parseCareTypes(value);
  if (types.length === 1) {
    return CARE_TYPE_OPTIONS.find((o) => o.value === types[0])?.label ?? types[0];
  }
  if (types.length > 1) return careTypesLabel(value);
  const found = CARE_TYPE_OPTIONS.find((o) => o.value === value);
  return found?.label ?? '—';
}

/** П — профессиональный, Д — домашний, П/Д — оба */
export function careTypeAbbreviation(value: string | null | undefined): 'П' | 'Д' | 'П/Д' | null {
  const types = parseCareTypes(value);
  const hasHome = types.includes('home');
  const hasPro = types.includes('professional');
  if (hasHome && hasPro) return 'П/Д';
  if (hasPro) return 'П';
  if (hasHome) return 'Д';
  return null;
}
