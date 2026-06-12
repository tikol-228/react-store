export const ORDER_STATUSES = [
  'pending',
  'processing',
  'shipped',
  'ready_for_pickup',
  'picked_up',
  'delivered',
  'cancelled',
];

export const ORDER_STATUS_LABELS = {
  pending: 'В ожидании',
  processing: 'В обработке',
  shipped: 'Отправлено',
  ready_for_pickup: 'Готов к выдаче',
  picked_up: 'Получен',
  delivered: 'Доставлено',
  cancelled: 'Отменено',
};

export function isValidOrderStatus(status) {
  return ORDER_STATUSES.includes(status);
}
