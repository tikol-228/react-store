import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Cart: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, totalPrice } = useCart();

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

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-20 text-center shadow-sm border border-gray-100">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#F3F4F0] rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-[#1B4B43]">
              <ShoppingBag size={32} className="sm:w-10 sm:h-10" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] mb-2">Ваша корзина пуста</h2>
            <p className="text-sm sm:text-base text-gray-500 mb-6 sm:mb-8">Самое время добавить в неё что-нибудь полезное для вашей красоты.</p>
            <Link to="/" className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-[#1B4B43] text-white rounded-full font-bold hover:bg-[#2a6b5f] transition-all text-sm sm:text-base">
              Перейти к покупкам
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-3 sm:space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white p-3 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-3 sm:gap-6 items-start sm:items-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#F6F6F6] rounded-lg sm:rounded-xl overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
                  </div>
                  
                  <div className="flex-grow flex-1 min-w-0">
                    <span className="text-[8px] sm:text-[10px] text-[#A0A0A0] uppercase tracking-widest font-bold">{item.category}</span>
                    <h3 className="text-sm sm:text-base font-bold text-[#1A1A1A] mb-1 line-clamp-2">{item.title}</h3>
                    <p className="text-sm sm:text-base text-[#1B4B43] font-bold">${item.price.toFixed(2)}</p>
                  </div>

                  <div className="flex items-center gap-2 bg-[#F3F4F0] p-1 rounded-lg flex-shrink-0">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 hover:bg-white rounded-md transition-colors"
                    >
                      <Minus size={14} className="sm:w-4 sm:h-4" />
                    </button>
                    <span className="w-6 sm:w-8 text-center font-bold text-xs sm:text-sm">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:bg-white rounded-md transition-colors"
                    >
                      <Plus size={14} className="sm:w-4 sm:h-4" />
                    </button>
                  </div>

                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                  >
                    <Trash2 size={18} className="sm:w-5 sm:h-5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 sticky top-24 sm:top-32">
                <h2 className="text-lg sm:text-xl font-bold text-[#1A1A1A] mb-4 sm:mb-6">Итог заказа</h2>
                
                <div className="space-y-2 sm:space-y-4 mb-6 sm:mb-8">
                  <div className="flex justify-between text-xs sm:text-sm text-gray-500">
                    <span>Товары ({cartItems.length})</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm text-gray-500">
                    <span>Доставка</span>
                    <span className="text-[#1B4B43] font-medium">Бесплатно</span>
                  </div>
                  <div className="pt-2 sm:pt-4 border-t border-gray-100 flex justify-between text-base sm:text-xl font-bold text-[#1A1A1A]">
                    <span>Всего</span>
                    <span>${totalPrice.toFixed(2)}</span>
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
