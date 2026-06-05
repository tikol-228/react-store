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
];

export function isValidSkinType(value) {
  return PRODUCT_SKIN_TYPES.includes(value);
}

export const SKIN_TYPE_LABELS = {
  all_types: 'для всех типов кожи',
  normal: 'нормальная',
  sensitive: 'чувствительная',
  combination: 'комбинированная',
  oily: 'жирная',
  dry: 'сухая',
  problematic: 'проблемная',
  mature: 'возрастная',
  acne: 'для всех типов с высыпаниями',
};

export function parseSkinTypes(value) {
  if (value == null || value === '') return [];

  if (Array.isArray(value)) {
    return value.filter(isValidSkinType);
  }

  const trimmed = String(value).trim();
  if (trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.filter(isValidSkinType);
      }
    } catch {
      /* CSV fallback */
    }
  }

  return trimmed
    .split(',')
    .map((part) => part.trim())
    .filter(isValidSkinType);
}

export function serializeSkinTypes(types) {
  const valid = parseSkinTypes(types);
  return valid.length ? JSON.stringify(valid) : null;
}

export function normalizeSkinTypeInput(value) {
  const types = parseSkinTypes(value);
  return types.length ? serializeSkinTypes(types) : null;
}

export function skinTypeMatchesFilter(stored, filterType) {
  const types = parseSkinTypes(stored);
  if (!types.length) return false;
  if (types.includes('all_types')) return true;
  if (filterType === 'all_types') return true;
  return types.includes(filterType);
}
