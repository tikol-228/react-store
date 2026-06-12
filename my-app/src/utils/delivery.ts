import { companyInfo } from '../data/company';

/** Доставка по Минску (в пределах МКАД) — см. раздел «Доставка» */
export const FREE_DELIVERY_MIN_AMOUNT = 350;
export const MINSK_DELIVERY_FEE = 15;

export type FulfillmentMethod = 'delivery' | 'pickup';

export function getPickupAddressLine(): string {
  const { country, city, street } = companyInfo.pickupAddress;
  return `${country}, ${city}, ${street}`;
}

export function getMinskDeliveryFee(
  subtotal: number,
  method: FulfillmentMethod = 'delivery'
): number {
  if (method === 'pickup' || subtotal <= 0) return 0;
  return subtotal >= FREE_DELIVERY_MIN_AMOUNT ? 0 : MINSK_DELIVERY_FEE;
}

export function getOrderTotal(subtotal: number, method: FulfillmentMethod = 'delivery'): number {
  return subtotal + getMinskDeliveryFee(subtotal, method);
}

export function formatDeliveryLine(fee: number, method?: FulfillmentMethod): string {
  if (method === 'pickup') return 'Самовывоз';
  return fee === 0 ? 'Бесплатно' : `${fee.toFixed(2)} руб.`;
}

export const DELIVERY_HINT =
  'По Минску (в пределах МКАД). Бесплатно от 350 руб., при заказе менее 350 руб. — 15 руб.';

export const PICKUP_HINT =
  'Самовывоз из офиса в Минске после подтверждения и оплаты заказа. Доставка не оплачивается.';
