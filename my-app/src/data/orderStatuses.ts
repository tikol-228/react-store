export const ORDER_STATUSES = [
  'pending',
  'processing',
  'shipped',
  'ready_for_pickup',
  'picked_up',
  'delivered',
  'cancelled',
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: 'pending', label: 'В ожидании' },
  { value: 'processing', label: 'В обработке' },
  { value: 'shipped', label: 'Отправлено' },
  { value: 'ready_for_pickup', label: 'Готов к выдаче' },
  { value: 'picked_up', label: 'Получен' },
  { value: 'delivered', label: 'Доставлено' },
  { value: 'cancelled', label: 'Отменено' },
];

export function orderStatusLabel(status: string): string {
  return ORDER_STATUS_OPTIONS.find((o) => o.value === status)?.label ?? status;
}

const SHARED_STATUS_OPTIONS = ORDER_STATUS_OPTIONS.filter((o) =>
  ['pending', 'processing', 'cancelled'].includes(o.value)
);

const DELIVERY_STATUS_OPTIONS = ORDER_STATUS_OPTIONS.filter((o) =>
  ['shipped', 'delivered'].includes(o.value)
);

const PICKUP_STATUS_OPTIONS = ORDER_STATUS_OPTIONS.filter((o) =>
  ['ready_for_pickup', 'picked_up'].includes(o.value)
);

export function isPickupOrder(order: {
  shipping_address?: string;
  comment?: string | null;
}): boolean {
  const text = `${order.shipping_address || ''} ${order.comment || ''}`.toLowerCase();
  return text.includes('самовывоз');
}

/** Статусы в админке: для самовывоза — «Готов к выдаче» / «Получен», для доставки — «Отправлено» / «Доставлено» */
export function orderStatusOptionsForOrder(order: {
  shipping_address?: string;
  comment?: string | null;
  status: string;
}) {
  const flowOptions = isPickupOrder(order) ? PICKUP_STATUS_OPTIONS : DELIVERY_STATUS_OPTIONS;
  const options = [...SHARED_STATUS_OPTIONS, ...flowOptions];

  if (!options.some((o) => o.value === order.status)) {
    const current = ORDER_STATUS_OPTIONS.find((o) => o.value === order.status);
    if (current) return [...options, current];
  }

  return options;
}

export function orderStatusColorClass(status: string): string {
  switch (status) {
    case 'delivered':
    case 'picked_up':
      return 'bg-green-50 text-green-800 border-green-400';
    case 'cancelled':
      return 'bg-red-50 text-red-800 border-red-400';
    case 'shipped':
    case 'ready_for_pickup':
      return 'bg-yellow-50 text-yellow-900 border-yellow-400';
    case 'processing':
      return 'bg-blue-50 text-blue-800 border-blue-300';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-300';
  }
}

export function orderStatusSelectClass(status: string): string {
  return `text-sm font-semibold rounded-md px-2 py-1 max-w-[168px] border focus:outline-none focus:ring-2 focus:ring-[#1B4B43]/30 ${orderStatusColorClass(status)}`;
}
