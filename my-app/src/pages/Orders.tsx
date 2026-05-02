import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Package, Clock, CheckCircle, XCircle, Truck, MapPin, CreditCard } from 'lucide-react';

interface Order {
  id: string;
  userId: string;
  items: any[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  shippingAddress: string;
  paymentMethod: string;
}

const Orders: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, [user]);

  const loadOrders = () => {
    if (!user) return;

    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      const allOrders: Order[] = JSON.parse(savedOrders);
      const userOrders = allOrders.filter(order => order.userId === user.id);
      setOrders(userOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }
    setIsLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} className="text-yellow-500" />;
      case 'processing':
        return <Package size={16} className="text-blue-500" />;
      case 'shipped':
        return <Truck size={16} className="text-purple-500" />;
      case 'delivered':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'cancelled':
        return <XCircle size={16} className="text-red-500" />;
      default:
        return <Clock size={16} className="text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Ожидает обработки';
      case 'processing':
        return 'В обработке';
      case 'shipped':
        return 'Отправлен';
      case 'delivered':
        return 'Доставлен';
      case 'cancelled':
        return 'Отменен';
      default:
        return 'Неизвестный статус';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'processing':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'shipped':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'delivered':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#1B4B43]/20 border-t-[#1B4B43] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Загрузка заказов...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#1A1A1A] mb-2">Мои заказы</h1>
          <p className="text-gray-400">История ваших покупок</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <Package size={40} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-bold text-gray-600 mb-2">У вас пока нет заказов</h2>
            <p className="text-gray-400">Когда вы совершите покупку, она появится здесь</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6">
                  {/* Order Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#1B4B43]/10 rounded-full flex items-center justify-center">
                        <Package size={20} className="text-[#1B4B43]" />
                      </div>
                      <div>
                        <p className="font-bold text-[#1A1A1A]">Заказ #{order.id.slice(-8)}</p>
                        <p className="text-sm text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString('ru-RU', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-bold ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {getStatusText(order.status)}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mb-4">
                    <h3 className="font-bold text-gray-700 mb-2">Товары ({order.items.length})</h3>
                    <div className="space-y-2">
                      {order.items.slice(0, 3).map((item: any, index: number) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{item.title}</p>
                            <p className="text-sm text-gray-500">Кол-во: {item.quantity}</p>
                          </div>
                          <p className="font-bold text-[#1B4B43]">{item.price * item.quantity} ₽</p>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <p className="text-sm text-gray-500 text-center py-2">
                          И еще {order.items.length - 3} товара(ов)
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Order Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin size={14} />
                        {order.shippingAddress}
                      </div>
                      <div className="flex items-center gap-1">
                        <CreditCard size={14} />
                        {order.paymentMethod}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Итого</p>
                      <p className="text-xl font-bold text-[#1B4B43]">{order.total} ₽</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;