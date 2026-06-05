/**
 * Форматирует цену в белорусские рубли
 */
export const formatPrice = (price: number, decimals: number = 2): string => {
  return `${price.toFixed(decimals)} руб.`;
};

/**
 * То же, что formatPrice (символ в конце)
 */
export const formatPriceWithSymbol = (price: number, decimals: number = 2): string => {
  return `${price.toFixed(decimals)} руб.`;
};
