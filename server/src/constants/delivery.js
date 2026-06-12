/** Доставка по Минску (в пределах МКАД) */
export const FREE_DELIVERY_MIN_AMOUNT = 350;
export const MINSK_DELIVERY_FEE = 15;

export const PICKUP_ADDRESS = 'Беларусь, г. Минск, ул. Амураторская д.4 ком.103';

export function getMinskDeliveryFee(subtotal, fulfillmentMethod = 'delivery') {
  if (fulfillmentMethod === 'pickup' || subtotal <= 0) return 0;
  return subtotal >= FREE_DELIVERY_MIN_AMOUNT ? 0 : MINSK_DELIVERY_FEE;
}

export function buildDeliveryComment(fee) {
  if (fee === 0) {
    return 'Доставка по Минску (МКАД): бесплатно';
  }
  return `Доставка по Минску (МКАД): ${fee.toFixed(2)} руб.`;
}

export function buildFulfillmentComment(fulfillmentMethod, deliveryFee) {
  if (fulfillmentMethod === 'pickup') {
    return `Самовывоз: ${PICKUP_ADDRESS}`;
  }
  return buildDeliveryComment(deliveryFee);
}

export function resolveShippingAddress(shipping_address, fulfillmentMethod) {
  if (fulfillmentMethod === 'pickup') {
    const trimmed = String(shipping_address || '').trim();
    if (trimmed) return trimmed;
    return `Самовывоз: ${PICKUP_ADDRESS}`;
  }
  return shipping_address;
}
