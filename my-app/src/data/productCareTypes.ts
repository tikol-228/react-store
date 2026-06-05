export const PRODUCT_CARE_TYPES = ['home', 'professional'] as const;

export type ProductCareType = (typeof PRODUCT_CARE_TYPES)[number];

export const CARE_TYPE_OPTIONS: { value: ProductCareType; label: string }[] = [
  { value: 'home', label: 'Домашний уход' },
  { value: 'professional', label: 'Профессиональный' },
];

export function careTypeLabel(value: string | null | undefined): string {
  const found = CARE_TYPE_OPTIONS.find((o) => o.value === value);
  return found?.label ?? '—';
}
