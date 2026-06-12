export const PRODUCT_CARE_TYPES = ['home', 'professional'];

export function isValidCareType(value) {
  return PRODUCT_CARE_TYPES.includes(value);
}

export const CARE_TYPE_LABELS = {
  home: 'Домашний уход',
  professional: 'Профессиональный',
};

export function parseCareTypes(value) {
  if (value == null || value === '') return [];

  if (Array.isArray(value)) {
    return value.filter(isValidCareType);
  }

  const trimmed = String(value).trim();
  if (trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.filter(isValidCareType);
      }
    } catch {
      /* CSV fallback */
    }
  }

  return trimmed
    .split(',')
    .map((part) => part.trim())
    .filter(isValidCareType);
}

export function serializeCareTypes(types) {
  const valid = parseCareTypes(types);
  return valid.length ? JSON.stringify(valid) : null;
}

export function normalizeCareTypeInput(value) {
  const types = parseCareTypes(value);
  return types.length ? serializeCareTypes(types) : null;
}

export function careTypeMatchesFilter(stored, filterType) {
  return parseCareTypes(stored).includes(filterType);
}
