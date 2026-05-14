import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { CheckCircle2, Download, Printer, Home } from 'lucide-react';
import { formatPrice } from '../utils/formatPrice';

const Success: React.FC = () => {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return <Navigate to="/" />;
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-20">
        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-[#1B4B43] p-12 text-center text-white relative">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-md">
              <CheckCircle2 size={40} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-2">Заказ подтвержден!</h1>
            <p className="text-white/70">Спасибо за ваш заказ. Мы уже начали его готовить.</p>
            
            {/* Order ID Badge */}
            <div className="absolute top-8 right-8 bg-white/10 px-4 py-2 rounded-full text-xs font-bold tracking-widest backdrop-blur-md border border-white/20">
              #{order.id}
            </div>
          </div>

          <div className="p-12">
            {/* Receipt Content */}
            <div id="receipt" className="space-y-8">
              <div className="flex justify-between items-start pb-8 border-b border-gray-100">
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Информация о доставке</h3>
                  <p className="text-[#1A1A1A] font-bold text-lg">{order.customer.firstName} {order.customer.lastName}</p>
                  <p className="text-gray-500">{order.customer.phone}</p>
                  <p className="text-gray-500">{order.customer.address}, {order.customer.city}</p>
                  <p className="text-gray-500">{order.customer.postalCode}</p>
                </div>
                <div className="text-right">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Дата заказа</h3>
                  <p className="text-[#1A1A1A] font-bold">{order.date}</p>
                  <p className="text-gray-500 mt-4 uppercase text-[10px] font-bold tracking-widest">Метод оплаты</p>
                  <p className="text-[#1B4B43] font-bold">{order.customer.paymentMethod === 'card' ? 'Банковская карта' : 'При получении'}</p>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Ваши покупки</h3>
                <div className="space-y-4">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center bg-[#FAF9F6] p-4 rounded-2xl">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-lg p-1">
                          <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#1A1A1A]">{item.title}</p>
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">{item.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-[#1A1A1A]">{formatPrice(item.price * item.quantity)}</p>
                        <p className="text-[10px] text-gray-400 font-bold">x{item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8 border-t border-gray-100 space-y-3">
                <div className="flex justify-between text-gray-500">
                  <span>Сумма</span>
                  <span className="font-bold text-[#1A1A1A]">{formatPrice(order.total)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Доставка</span>
                  <span className="font-bold text-[#1B4B43]">Бесплатно</span>
                </div>
                <div className="flex justify-between text-2xl font-bold text-[#1A1A1A] pt-4">
                  <span>Итого к оплате</span>
                  <span className="text-[#1B4B43]">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-12 flex flex-col sm:flex-row gap-4 no-print">
              <button 
                onClick={handlePrint}
                className="flex-1 flex items-center justify-center gap-2 py-4 border border-gray-200 rounded-full font-bold text-gray-600 hover:bg-[#F3F4F0] transition-all"
              >
                <Printer size={18} />
                Распечатать чек
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-4 border border-gray-200 rounded-full font-bold text-gray-600 hover:bg-[#F3F4F0] transition-all">
                <Download size={18} />
                Скачать PDF
              </button>
              <Link 
                to="/"
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-[#1B4B43] text-white rounded-full font-bold hover:bg-[#2a6b5f] transition-all"
              >
                <Home size={18} />
                На главную
              </Link>
            </div>
          </div>
        </div>
        
        <p className="text-center mt-8 text-gray-400 text-sm">
          Копия чека была отправлена на вашу почту: <span className="text-[#1B4B43] font-bold">{order.customer.email}</span>
        </p>
      </main>

      <Footer />
      
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          main { padding: 0 !important; }
          .bg-[#1B4B43] { background-color: #1B4B43 !important; -webkit-print-color-adjust: exact; }
          header, footer { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default Success;
