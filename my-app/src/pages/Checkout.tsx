import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ArrowLeft, ShieldCheck, Truck, CreditCard } from 'lucide-react';

const Checkout: React.FC = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'card'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create order object
    const order = {
      id: `ORD-${Date.now()}`,
      date: new Date().toLocaleString('ru-RU'),
      customer: {
        ...formData,
        userId: user?.id || 'guest'
      },
      items: cartItems,
      total: totalPrice,
      status: 'Новый'
    };

    // Save to localStorage (Admin panel orders)
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    localStorage.setItem('orders', JSON.stringify([...existingOrders, order]));

    // Clear cart and navigate to success
    clearCart();
    navigate('/success', { state: { order } });
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-12">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-[#1A1A1A] mb-8 transition-colors">
          <ArrowLeft size={18} />
          <span>Вернуться в корзину</span>
        </button>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contact Info */}
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-[#1A1A1A] mb-6 flex items-center gap-2">
                <div className="w-8 h-8 bg-[#F3F4F0] rounded-full flex items-center justify-center text-[#1B4B43]">1</div>
                Контактная информация
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Имя</label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full bg-[#FAF9F6] border-none rounded-xl p-4 focus:ring-2 focus:ring-[#1B4B43]/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Фамилия</label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full bg-[#FAF9F6] border-none rounded-xl p-4 focus:ring-2 focus:ring-[#1B4B43]/20 transition-all"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-[#FAF9F6] border-none rounded-xl p-4 focus:ring-2 focus:ring-[#1B4B43]/20 transition-all"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Телефон</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="+7 (___) ___-__-__"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-[#FAF9F6] border-none rounded-xl p-4 focus:ring-2 focus:ring-[#1B4B43]/20 transition-all"
                  />
                </div>
              </div>
            </section>

            {/* Shipping Info */}
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-[#1A1A1A] mb-6 flex items-center gap-2">
                <div className="w-8 h-8 bg-[#F3F4F0] rounded-full flex items-center justify-center text-[#1B4B43]">2</div>
                Адрес доставки
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Адрес (улица, дом, кв)</label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full bg-[#FAF9F6] border-none rounded-xl p-4 focus:ring-2 focus:ring-[#1B4B43]/20 transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Город</label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full bg-[#FAF9F6] border-none rounded-xl p-4 focus:ring-2 focus:ring-[#1B4B43]/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Почтовый индекс</label>
                    <input
                      type="text"
                      name="postalCode"
                      required
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="w-full bg-[#FAF9F6] border-none rounded-xl p-4 focus:ring-2 focus:ring-[#1B4B43]/20 transition-all"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-[#1A1A1A] mb-6 flex items-center gap-2">
                <div className="w-8 h-8 bg-[#F3F4F0] rounded-full flex items-center justify-center text-[#1B4B43]">3</div>
                Способ оплаты
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className={`relative flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${formData.paymentMethod === 'card' ? 'border-[#1B4B43] bg-[#F3F4F0]' : 'border-gray-100 bg-[#FAF9F6]'}`}>
                  <input type="radio" name="paymentMethod" value="card" checked={formData.paymentMethod === 'card'} onChange={handleInputChange} className="hidden" />
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#1B4B43]">
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Банковская карта</p>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Онлайн оплата</p>
                  </div>
                </label>
                <label className={`relative flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${formData.paymentMethod === 'cash' ? 'border-[#1B4B43] bg-[#F3F4F0]' : 'border-gray-100 bg-[#FAF9F6]'}`}>
                  <input type="radio" name="paymentMethod" value="cash" checked={formData.paymentMethod === 'cash'} onChange={handleInputChange} className="hidden" />
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#1B4B43]">
                    <Truck size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-sm">При получении</p>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Курьеру или в ПВЗ</p>
                  </div>
                </label>
              </div>
            </section>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-32">
              <h2 className="text-xl font-bold text-[#1A1A1A] mb-6">Ваш заказ</h2>
              
              <div className="space-y-4 max-h-60 overflow-y-auto mb-6 pr-2 custom-scrollbar">
                {cartItems.map(item => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-[#F6F6F6] rounded-lg overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-xs font-bold text-[#1A1A1A] truncate">{item.title}</p>
                      <p className="text-[10px] text-gray-400">x{item.quantity} — ${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 mb-8 pt-6 border-t border-gray-100">
                <div className="flex justify-between text-gray-500 text-sm">
                  <span>Сумма</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500 text-sm">
                  <span>Доставка</span>
                  <span className="text-[#1B4B43]">Бесплатно</span>
                </div>
                <div className="pt-4 flex justify-between text-xl font-bold text-[#1A1A1A]">
                  <span>Итого</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-[#1B4B43] text-white rounded-full font-bold hover:bg-[#2a6b5f] transition-all shadow-lg shadow-[#1B4B43]/20 mb-6"
              >
                Подтвердить заказ
              </button>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-400">
                  <ShieldCheck size={18} className="text-[#1B4B43]" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Безопасность данных гарантирована</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
