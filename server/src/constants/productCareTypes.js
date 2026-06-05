export const PRODUCT_CARE_TYPES = ['home', 'professional'];

export function isValidCareType(value) {
  return PRODUCT_CARE_TYPES.includes(value);
}

export const CARE_TYPE_LABELS = {
  home: 'Домашний уход',
  professional: 'Профессиональный',
};
