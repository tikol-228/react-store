import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { formatPrice } from '../utils/formatPrice';
import {
  formatDeliveryLine,
  getMinskDeliveryFee,
  getOrderTotal,
} from '../utils/delivery';

const Cart: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, totalPrice, isLoading, totalItems } = useCart();
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const handleQuantity = async (productId: number, nextQty: number) => {
    setError(null);
    setUpdatingId(productId);
    try {
      if (nextQty <= 0) {
        await removeFromCart(productId);
      } else {
        await updateQuantity(productId, nextQty);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось изменить количество');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleInputBlur = async (
    productId: number,
    currentQty: number,
    stock: number,
    raw: string
  ) => {
    const parsed = parseInt(raw, 10);
    if (Number.isNaN(parsed) || parsed < 1) return;
    const nextQty = Math.min(parsed, stock);
    if (nextQty === currentQty) return;
    await handleQuantity(productId, nextQty);
  };

  const handleRemove = async (productId: number) => {
    setError(null);
    setUpdatingId(productId);
    try {
      await removeFromCart(productId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось удалить товар');
    } finally {
      setUpdatingId(null);
    }
  };

  const deliveryFee = getMinskDeliveryFee(totalPrice);
  const orderTotal = getOrderTotal(totalPrice);

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Header />

      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-12">
        <div className="flex items-center gap-2 sm:gap-4 mb-6 sm:mb-8">
          <Link to="/" className="p-2 hover:bg-white rounded-full transition-colors flex-shrink-0">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A]">Корзина</h1>
        </div>

        {error && (
          <div className="mb-4 p-3 sm:p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            {error}
          </div>
        )}

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-20 text-center shadow-sm border border-gray-100">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#F3F4F0] rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-[#1B4B43]">
              <ShoppingBag size={32} className="sm:w-10 sm:h-10" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] mb-2">Ваша корзина пуста</h2>
            <p className="text-sm sm:text-base text-gray-500 mb-6 sm:mb-8">
              Самое время добавить в неё что-нибудь полезное для вашей красоты.
            </p>
            <Link
              to="/"
              className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-[#1B4B43] text-white rounded-full font-bold hover:bg-[#2a6b5f] transition-all text-sm sm:text-base"
            >
              Перейти к покупкам
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
            <div className="lg:col-span-2 space-y-3 sm:space-y-4">
              {cartItems.map((item) => {
                const isUpdating = updatingId === item.product_id || isLoading;
                const atMax = item.quantity >= item.stock_quantity;

                return (
                  <div
                    key={item.product_id}
                    className="bg-white p-3 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-3 sm:gap-6 items-start sm:items-center"
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#F6F6F6] rounded-lg sm:rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={item.image_url || '/placeholder-product.jpg'}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex-grow flex-1 min-w-0">
                      <span className="text-[8px] sm:text-[10px] text-[#A0A0A0] uppercase tracking-widest font-bold">
                        Товар
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-[#1A1A1A] mb-1 line-clamp-2">
                        {item.name}
                      </h3>
                      <p className="text-sm sm:text-base text-[#1B4B43] font-bold">
                        {formatPrice(item.price)}
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
                        На складе: {item.stock_quantity} шт.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 bg-[#F3F4F0] p-1 rounded-lg flex-shrink-0">
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => handleQuantity(item.product_id, item.quantity - 1)}
                        className="p-1 hover:bg-white rounded-md transition-colors disabled:opacity-40"
                        aria-label="Уменьшить количество"
                      >
                        <Minus size={14} className="sm:w-4 sm:h-4" />
                      </button>

                      <input
                        type="number"
                        min={1}
                        max={item.stock_quantity}
                        value={item.quantity}
                        disabled={isUpdating}
                        onBlur={(e) =>
                          handleInputBlur(
                            item.product_id,
                            item.quantity,
                            item.stock_quantity,
                            e.target.value
                          )
                        }
                        className="w-10 sm:w-12 text-center font-bold text-xs sm:text-sm bg-transparent border-0 focus:outline-none focus:ring-1 focus:ring-[#1B4B43]/30 rounded [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        aria-label="Количество"
                      />

                      <button
                        type="button"
                        disabled={isUpdating || atMax}
                        onClick={() => handleQuantity(item.product_id, item.quantity + 1)}
                        className="p-1 hover:bg-white rounded-md transition-colors disabled:opacity-40"
                        aria-label="Увеличить количество"
                      >
                        <Plus size={14} className="sm:w-4 sm:h-4" />
                      </button>
                    </div>

                    <div className="flex flex-col items-end gap-1 flex-shrink-0 sm:min-w-[72px]">
                      <p className="text-sm sm:text-base font-bold text-[#1A1A1A]">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => handleRemove(item.product_id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-40"
                        aria-label="Удалить из корзины"
                      >
                        <Trash2 size={18} className="sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 sticky top-24 sm:top-32">
                <h2 className="text-lg sm:text-xl font-bold text-[#1A1A1A] mb-4 sm:mb-6">Итог заказа</h2>

                <div className="space-y-2 sm:space-y-4 mb-6 sm:mb-8">
                  <div className="flex justify-between text-xs sm:text-sm text-gray-500">
                    <span>
                      Товары ({totalItems} {totalItems === 1 ? 'шт.' : 'шт.'})
                    </span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm text-gray-500">
                    <span>Доставка</span>
                    <span className={deliveryFee === 0 ? 'text-[#1B4B43] font-medium' : 'font-medium text-gray-800'}>
                      {formatDeliveryLine(deliveryFee)}
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-xs text-gray-400 leading-snug">
                    При самовывозе доставка не оплачивается — выберите при оформлении заказа.
                  </p>
                  <div className="pt-2 sm:pt-4 border-t border-gray-100 flex justify-between text-base sm:text-xl font-bold text-[#1A1A1A]">
                    <span>Всего</span>
                    <span>{formatPrice(orderTotal)}</span>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  className="block w-full py-3 sm:py-4 bg-[#1B4B43] text-white text-center rounded-full font-bold text-sm sm:text-base hover:bg-[#2a6b5f] transition-all shadow-lg shadow-[#1B4B43]/20"
                >
                  Оформить заказ
                </Link>

                <p className="mt-3 sm:mt-4 text-[9px] sm:text-[10px] text-center text-gray-400 uppercase tracking-widest font-bold">
                  Безопасная оплата и быстрая доставка
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
