export const STORE_BRAND_NAMES = [
  'DIBI Milano',
  'Germaine de Capuccini',
];

export function isAllowedBrandName(name) {
  return STORE_BRAND_NAMES.includes(name);
}
