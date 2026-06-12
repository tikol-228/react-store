import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ordersAPI } from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Package, Clock, CheckCircle, XCircle, Truck, MapPin, CreditCard, ShoppingBag, ArrowLeft } from 'lucide-react';
import { formatPrice } from '../utils/formatPrice';
import { goToProductsCatalog } from '../utils/scrollToSection';
import { orderStatusLabel, orderStatusColorClass, type OrderStatus } from '../data/orderStatuses';

interface OrderItem {
  product_name: string;
  image_url?: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  customer_name: string;
  customer_email: string;
  shipping_address: string;
  total_amount: number;
  status: OrderStatus;
  created_at: string;
  items?: OrderItem[];
}

const Orders: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      if (!user) {
        setOrders([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await ordersAPI.getOrders({ limit: 50 });
        setOrders(response.data.orders || []);
      } catch (error) {
        console.error('Failed to load orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} className="text-yellow-500" />;
      case 'processing':
        return <Package size={16} className="text-blue-500" />;
      case 'shipped':
        return <Truck size={16} className="text-yellow-600" />;
      case 'ready_for_pickup':
        return <Package size={16} className="text-yellow-600" />;
      case 'picked_up':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'delivered':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'cancelled':
        return <XCircle size={16} className="text-red-500" />;
      default:
        return <Clock size={16} className="text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => orderStatusLabel(status);

  const getStatusColor = (status: string) =>
    `${orderStatusColorClass(status)} font-bold`;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6]">
        <Header />
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#1B4B43]/20 border-t-[#1B4B43] rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Загрузка заказов...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Header />
      <main className="max-w-6xl mx-auto px-3 sm:px-6 py-8 sm:py-16">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link
            to="/#products"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#1B4B43] mb-4 transition-colors"
          >
            <ArrowLeft size={16} />
            Вернуться в магазин
          </Link>
          <h1 className="text-2xl sm:text-4xl font-bold text-[#1A1A1A] mb-2">Мои заказы</h1>
          <p className="text-sm sm:text-base text-gray-400">История ваших покупок</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <Package size={40} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-bold text-gray-600 mb-2">У вас пока нет заказов</h2>
            <p className="text-gray-400 mb-6">Когда вы совершите покупку, она появится здесь</p>
            <button
              type="button"
              onClick={() => goToProductsCatalog()}
              className="inline-flex items-center gap-2 bg-[#1B4B43] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#2a6b5f] transition-all"
            >
              <ShoppingBag size={18} />
              Перейти в каталог
            </button>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl sm:rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 sm:p-6">
                  {/* Order Header */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#1B4B43]/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Package size={20} className="text-[#1B4B43]" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-[#1A1A1A]">Заказ #{order.id}</p>
                        <p className="text-xs sm:text-sm text-gray-400">
                          {new Date(order.created_at).toLocaleDateString('ru-RU', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className={`self-start flex items-center gap-2 px-3 py-1 rounded-full border text-xs sm:text-sm font-bold ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {getStatusText(order.status)}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mb-4">
                    <h3 className="font-bold text-gray-700 mb-2 text-sm sm:text-base">Товары ({order.items?.length ?? 0})</h3>
                    <div className="space-y-2">
                      {(order.items ?? []).slice(0, 3).map((item, index) => (
                        <div key={index} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                          <img
                            src={item.image_url || '/placeholder-product.jpg'}
                            alt={item.product_name}
                            className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 text-sm sm:text-base leading-snug line-clamp-3">
                              {item.product_name}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1">Кол-во: {item.quantity}</p>
                          </div>
                          <p className="font-bold text-[#1B4B43] text-sm sm:text-base flex-shrink-0 self-start whitespace-nowrap pt-0.5">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      ))}
                      {((order.items ?? []).length > 3) && (
                        <p className="text-sm text-gray-500 text-center py-2">
                          И еще {(order.items ?? []).length - 3} товара(ов)
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Order Footer */}
                  <div className="flex flex-col gap-4 pt-4 border-t border-gray-100 sm:flex-row sm:items-end sm:justify-between">
                    <div className="space-y-2 text-xs sm:text-sm text-gray-600 min-w-0">
                      <div className="flex items-start gap-2">
                        <MapPin size={14} className="flex-shrink-0 mt-0.5 text-gray-400" />
                        <span className="break-words leading-relaxed">{order.shipping_address}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CreditCard size={14} className="flex-shrink-0 mt-0.5 text-gray-400" />
                        <span className="break-all leading-relaxed">{order.customer_email}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-4 border-t border-gray-100 pt-3 sm:border-0 sm:pt-0 sm:block sm:text-right flex-shrink-0">
                      <p className="text-sm text-gray-500">Итого</p>
                      <p className="text-lg sm:text-xl font-bold text-[#1B4B43] whitespace-nowrap">
                        {formatPrice(order.total_amount)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Orders;