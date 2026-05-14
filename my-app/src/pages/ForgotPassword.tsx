import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const getErrorMessage = (errorCode: string) => {
    const errorMessages: { [key: string]: string } = {
      'auth/invalid-email': 'Некорректный email адрес',
      'auth/user-not-found': 'Пользователь с этим email не найден',
      'auth/too-many-requests': 'Слишком много попыток. Попробуйте позже',
    };
    return errorMessages[errorCode] || 'Ошибка при отправке письма. Попробуйте еще раз';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!email) {
      setError('Пожалуйста, введите email');
      return;
    }

    setLoading(true);

    try {
      await resetPassword(email);
      setSuccess(true);
      setEmail('');
    } catch (err: any) {
      setError(err?.message || getErrorMessage(err.code || ''));
      console.error('Password reset error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-[#1A1A1A] mb-2">
            Восстановление пароля
          </h2>
          <p className="text-gray-600">
            Введите email для восстановления пароля
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-lg border border-gray-100 sm:rounded-2xl sm:px-10">
          {success ? (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-[#1A1A1A]">Письмо отправлено!</h3>
                <p className="text-gray-600">
                  Мы отправили письмо с инструкциями по восстановлению пароля на адрес:
                </p>
                <p className="font-semibold text-[#1B4B43]">{email}</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-lg text-sm space-y-2">
                <p className="font-semibold">Советы:</p>
                <ul className="space-y-1 text-left">
                  <li>• Проверьте папку "Спам" если не видите письма</li>
                  <li>• Ссылка действительна 1 час</li>
                  <li>• Если письмо не пришло, нажмите "Отправить заново"</li>
                </ul>
              </div>

              <button
                onClick={() => setSuccess(false)}
                className="text-[#1B4B43] hover:text-[#2a6b5f] font-semibold transition-colors"
              >
                Отправить заново
              </button>

              <Link
                to="/login"
                className="block mt-6 pt-6 border-t border-gray-200"
              >
                <button className="w-full bg-[#1B4B43] text-white font-semibold py-3 rounded-lg hover:bg-[#2a6b5f] transition-colors">
                  Вернуться к логину
                </button>
              </Link>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email адрес
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

              {/* Info */}
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg text-sm text-gray-600">
                <p>
                  На указанный email будет отправлено письмо со ссылкой для восстановления пароля.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1B4B43] text-white font-semibold py-3 rounded-lg hover:bg-[#2a6b5f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Отправляем...' : 'Отправить письмо'}
              </button>

              {/* Back to login */}
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 text-sm text-[#1B4B43] hover:text-[#2a6b5f] font-medium transition-colors mt-4 pt-4 border-t border-gray-200"
              >
                <ArrowLeft className="w-4 h-4" />
                Вернуться к входу
              </Link>
            </form>
          )}
        </div>

        {/* Additional Help */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            Нужна помощь?{' '}
            <Link to="/contacts" className="text-[#1B4B43] hover:underline font-medium">
              Свяжитесь с нами
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
