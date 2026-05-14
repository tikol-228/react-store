import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const getErrorMessage = (errorCode: string) => {
    const errorMessages: { [key: string]: string } = {
      'auth/email-already-in-use': 'Этот email уже зарегистрирован',
      'auth/invalid-email': 'Некорректный email адрес',
      'auth/weak-password': 'Пароль слишком короткий (минимум 6 символов)',
      'auth/operation-not-allowed': 'Регистрация временно недоступна',
      'auth/too-many-requests': 'Слишком много попыток. Попробуйте позже',
    };
    return errorMessages[errorCode] || 'Ошибка при регистрации. Попробуйте еще раз';
  };

  const validatePassword = (pwd: string) => {
    if (pwd.length < 6) return 'Пароль должен быть минимум 6 символов';
    if (!/[a-z]/.test(pwd)) return 'Пароль должен содержать строчные буквы';
    if (!/[A-Z]/.test(pwd)) return 'Пароль должен содержать заглавные буквы';
    if (!/[0-9]/.test(pwd)) return 'Пароль должен содержать цифры';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Валидация
    if (!name || !email || !password || !confirmPassword) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);

    try {
      const trimmed = name.trim();
      const parts = trimmed.split(/\s+/);
      const firstName = parts[0] || trimmed;
      const lastName = parts.slice(1).join(' ') || firstName;
      await register(firstName, lastName, email, password);
      setSuccess(true);
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    } catch (err: any) {
      setError(getErrorMessage(err.code || ''));
      console.error('Register error:', err);
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
            Создать аккаунт
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Присоединяйтесь к нашей семье красоты
          </p>
        </div>
      </div>

      <div className="mt-6 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-6 sm:py-8 px-4 sm:px-6 shadow-lg border border-gray-100 sm:rounded-2xl sm:px-10 rounded-xl">
          {success && (
            <div className="mb-4 sm:mb-6 bg-green-50 border border-green-200 text-green-700 p-3 sm:p-4 rounded-lg flex items-center gap-3">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <p className="text-xs sm:text-sm">Аккаунт успешно создан! Перенаправляем...</p>
            </div>
          )}

          <form className="space-y-3 sm:space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 sm:p-4 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Ваше имя
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Иван Петров"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4B43] focus:border-transparent transition-all"
                />
              </div>
            </div>

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

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Минимум 6 символов"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4B43] focus:border-transparent transition-all"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Должен содержать: прописные и строчные буквы, цифры
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Подтвердите пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Повторите пароль"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4B43] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Agree to terms */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                required
                className="w-4 h-4 mt-1 rounded border-gray-300 text-[#1B4B43] focus:ring-[#1B4B43]"
              />
              <span className="text-sm text-gray-600">
                Я согласен с{' '}
                <a href="#" className="text-[#1B4B43] hover:underline font-medium">
                  условиями использования
                </a>
                {' '}и{' '}
                <a href="#" className="text-[#1B4B43] hover:underline font-medium">
                  политикой конфиденциальности
                </a>
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1B4B43] text-white font-semibold py-3 rounded-lg hover:bg-[#2a6b5f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Создаём аккаунт...' : 'Зарегистрироваться'}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 mb-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Или</span>
              </div>
            </div>
          </div>

          {/* Sign in link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Уже есть аккаунт?{' '}
              <Link
                to="/login"
                className="font-semibold text-[#1B4B43] hover:text-[#2a6b5f] transition-colors"
              >
                Войти
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

export default Register;
