import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, AlertCircle } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const getErrorMessage = (errorCode: string) => {
    const errorMessages: { [key: string]: string } = {
      'auth/invalid-email': 'Некорректный email адрес',
      'auth/user-disabled': 'Этот аккаунт был отключен',
      'auth/user-not-found': 'Пользователь с этим email не найден',
      'auth/wrong-password': 'Неправильный пароль',
      'auth/invalid-credential': 'Неверные учетные данные',
      'auth/too-many-requests': 'Слишком много попыток входа. Попробуйте позже',
    };
    return errorMessages[errorCode] || 'Ошибка при входе. Попробуйте еще раз';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email || !password) {
        setError('Пожалуйста, заполните все поля');
        return;
      }
      
      await login(email, password);
      navigate('/profile');
    } catch (err: any) {
      setError(getErrorMessage(err.code || ''));
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#1B4B43] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col justify-center py-8 sm:py-12 px-3 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-2xl sm:text-4xl font-bold text-[#1A1A1A] mb-1 sm:mb-2">
            Добро пожаловать!
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Войдите в свой аккаунт
          </p>
        </div>
      </div>

      <div className="mt-6 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-6 sm:py-8 px-4 sm:px-6 shadow-lg border border-gray-100 sm:rounded-2xl sm:px-10 rounded-xl">
          <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 sm:p-4 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm">{error}</p>
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Email адрес
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 sm:top-3 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4B43] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 sm:top-3 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Введите пароль"
                  className="w-full pl-10 pr-4 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4B43] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-[#1B4B43] focus:ring-[#1B4B43]"
                />
                <span className="text-xs sm:text-sm text-gray-600">Запомнить меня</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-xs sm:text-sm text-[#1B4B43] hover:text-[#2a6b5f] font-medium transition-colors"
              >
                Забыли пароль?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1B4B43] text-white font-semibold py-2.5 sm:py-3 text-sm sm:text-base rounded-lg hover:bg-[#2a6b5f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Входим...' : 'Войти'}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-4 sm:mt-6 mb-4 sm:mb-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-xs sm:text-sm">
                <span className="px-2 bg-white text-gray-500">Или</span>
              </div>
            </div>
          </div>

          {/* Sign up link */}
          <div className="text-center">
            <p className="text-xs sm:text-sm text-gray-600">
              Нет аккаунта?{' '}
              <Link
                to="/register"
                className="font-semibold text-[#1B4B43] hover:text-[#2a6b5f] transition-colors"
              >
                Создайте новый
              </Link>
            </p>
          </div>

          {/* Back to store */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <Link
              to="/"
              className="text-sm text-gray-500 hover:text-gray-700 flex justify-center transition-colors"
            >
              ← Вернуться в магазин
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
