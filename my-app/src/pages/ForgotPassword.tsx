import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, AlertCircle } from 'lucide-react';
import { companyInfo } from '../data/company';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    const supportEmail = companyInfo.emails.primary;
    window.location.href = `mailto:${encodeURIComponent(supportEmail)}?subject=${encodeURIComponent('Восстановление пароля')}&body=${encodeURIComponent(`Здравствуйте! Прошу помочь восстановить доступ к аккаунту.\n\nEmail: ${email.trim()}`)}`;
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-[#1A1A1A] mb-2">Восстановление пароля</h2>
          <p className="text-gray-600">Автоматическое восстановление пока недоступно</p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-lg border border-gray-100 sm:rounded-2xl sm:px-10">
          <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-lg flex items-start gap-3 mb-6">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm">
              Напишите нам на почту или позвоните — менеджер поможет восстановить доступ к аккаунту.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Ваш email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4B43] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#1B4B43] text-white font-semibold py-3 rounded-lg hover:bg-[#2a6b5f] transition-colors"
            >
              Написать в поддержку
            </button>

            <Link
              to="/contacts"
              className="block w-full text-center py-3 border border-[#1B4B43] text-[#1B4B43] font-semibold rounded-lg hover:bg-[#1B4B43]/5 transition-colors"
            >
              Страница контактов
            </Link>

            <Link
              to="/login"
              className="flex items-center justify-center gap-2 text-sm text-[#1B4B43] hover:text-[#2a6b5f] font-medium transition-colors pt-4 border-t border-gray-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Вернуться к входу
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
