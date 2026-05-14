/**
 * Форматирует цену в беларусские рубли (BYN)
 * @param price - Числовое значение цены
 * @param decimals - Количество знаков после запятой (по умолчанию 2)
 * @returns Форматированная строка с символом BYN
 */
export const formatPrice = (price: number, decimals: number = 2): string => {
  return `Br ${price.toFixed(decimals)}`;
};

/**
 * Форматирует цену с символом BYN в конце
 * @param price - Числовое значение цены
 * @param decimals - Количество знаков после запятой (по умолчанию 2)
 * @returns Форматированная строка вида "X.XX Br"
 */
export const formatPriceWithSymbol = (price: number, decimals: number = 2): string => {
  return `${price.toFixed(decimals)} Br`;
};
