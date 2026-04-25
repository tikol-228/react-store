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
      
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/" className="p-2 hover:bg-white rounded-full transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-bold text-[#1A1A1A]">Корзина</h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 text-center shadow-sm border border-gray-100">
            <div className="w-20 h-20 bg-[#F3F4F0] rounded-full flex items-center justify-center mx-auto mb-6 text-[#1B4B43]">
              <ShoppingBag size={40} />
            </div>
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">Ваша корзина пуста</h2>
            <p className="text-gray-500 mb-8">Самое время добавить в неё что-нибудь полезное для вашей красоты.</p>
            <Link to="/" className="inline-block px-8 py-4 bg-[#1B4B43] text-white rounded-full font-bold hover:bg-[#2a6b5f] transition-all">
              Перейти к покупкам
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-6 items-center">
                  <div className="w-24 h-24 bg-[#F6F6F6] rounded-xl overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
                  </div>
                  
                  <div className="flex-grow">
                    <span className="text-[10px] text-[#A0A0A0] uppercase tracking-widest font-bold">{item.category}</span>
                    <h3 className="text-base font-bold text-[#1A1A1A] mb-1">{item.title}</h3>
                    <p className="text-[#1B4B43] font-bold">${item.price.toFixed(2)}</p>
                  </div>

                  <div className="flex items-center gap-3 bg-[#F3F4F0] p-1 rounded-lg">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 hover:bg-white rounded-md transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:bg-white rounded-md transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-32">
                <h2 className="text-xl font-bold text-[#1A1A1A] mb-6">Итог заказа</h2>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-gray-500">
                    <span>Товары ({cartItems.length})</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Доставка</span>
                    <span className="text-[#1B4B43] font-medium">Бесплатно</span>
                  </div>
                  <div className="pt-4 border-t border-gray-100 flex justify-between text-xl font-bold text-[#1A1A1A]">
                    <span>Всего</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <Link 
                  to="/checkout"
                  className="block w-full py-4 bg-[#1B4B43] text-white text-center rounded-full font-bold hover:bg-[#2a6b5f] transition-all shadow-lg shadow-[#1B4B43]/20"
                >
                  Оформить заказ
                </Link>
                
                <p className="mt-4 text-[10px] text-center text-gray-400 uppercase tracking-widest font-bold">
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
