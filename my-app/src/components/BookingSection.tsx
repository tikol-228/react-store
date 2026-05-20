import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Phone, Send, CheckCircle } from 'lucide-react';
import { companyInfo } from '../data/company';
import { contactsAPI } from '../services/api';

const DEFAULT_MESSAGE =
  'Здравствуйте! Хочу подобрать косметику и получить консультацию по уходу.';

const BookingSection = () => {
  const location = useLocation();
  const isBookingIntent =
    location.hash === '#booking' || new URLSearchParams(location.search).get('booking') === '1';

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(DEFAULT_MESSAGE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isBookingIntent) {
      requestAnimationFrame(() => {
        document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }, [isBookingIntent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError('Заполните имя, телефон и email');
      return;
    }

    setLoading(true);
    try {
      await contactsAPI.createBooking({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        message: message.trim() || DEFAULT_MESSAGE,
      });
      setSuccess(true);
      setName('');
      setPhone('');
      setEmail('');
      setMessage(DEFAULT_MESSAGE);
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      setError(msg || 'Не удалось отправить заявку. Позвоните нам или попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="booking" className="scroll-mt-28">
      <div className="bg-[#F3F4F0] rounded-2xl sm:rounded-3xl p-6 sm:p-10 border border-[#1B4B43]/10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <span className="text-[#D19D6B] font-bold text-xs uppercase tracking-widest">
              Подбор косметики
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] mt-2 mb-4">
              Подобрать косметику
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
              Оставьте заявку — мы свяжемся с вами, уточним тип кожи и подберём уход из нашего
              каталога профессиональной косметики.
            </p>
            <a
              href={`tel:${companyInfo.phone.replace(/\s/g, '')}`}
              className="inline-flex items-center gap-3 px-6 py-3 bg-[#1B4B43] text-white rounded-full font-semibold hover:bg-[#2a6b5f] transition-colors"
            >
              <Phone size={20} />
              Позвонить: {companyInfo.phone}
            </a>
          </div>

          {success ? (
            <div className="bg-white rounded-2xl p-8 flex flex-col items-center justify-center text-center">
              <CheckCircle className="w-14 h-14 text-[#1B4B43] mb-4" />
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">Заявка отправлена</h3>
              <p className="text-gray-600 text-sm">
                Мы свяжемся с вами в ближайшее время для консультации и подбора ухода.
              </p>
              <button
                type="button"
                onClick={() => setSuccess(false)}
                className="mt-6 text-[#1B4B43] font-semibold hover:underline text-sm"
              >
                Отправить ещё одну заявку
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
              {error && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 text-sm border border-red-100">
                  {error}
                </div>
              )}
              <div>
                <label htmlFor="booking-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Ваше имя *
                </label>
                <input
                  id="booking-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4B43]/20 focus:border-[#1B4B43]"
                  placeholder="Как к вам обращаться"
                  required
                />
              </div>
              <div>
                <label htmlFor="booking-phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Телефон *
                </label>
                <input
                  id="booking-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4B43]/20 focus:border-[#1B4B43]"
                  placeholder="+375 ..."
                  required
                />
              </div>
              <div>
                <label htmlFor="booking-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  id="booking-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4B43]/20 focus:border-[#1B4B43]"
                  placeholder="email@example.com"
                  required
                />
              </div>
              <div>
                <label htmlFor="booking-message" className="block text-sm font-medium text-gray-700 mb-1">
                  Пожелания по уходу
                </label>
                <textarea
                  id="booking-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4B43]/20 focus:border-[#1B4B43] resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#1A1A1A] text-white rounded-full font-semibold hover:bg-black transition-colors disabled:opacity-60"
              >
                <Send size={18} />
                {loading ? 'Отправка...' : 'Запросить подбор'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default BookingSection;
