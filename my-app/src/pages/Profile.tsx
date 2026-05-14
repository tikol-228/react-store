import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Mail, Phone, Lock, User, LogOut, Edit2, Save, X, AlertCircle } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isEditing, isSetEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
  });

  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone || '',
    });
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Пожалуйста, войдите в аккаунт</h2>
          <Link to="/login" className="inline-block px-6 py-3 bg-[#1B4B43] text-white rounded-lg hover:bg-[#2a6b5f] transition-colors">
            Перейти ко входу
          </Link>
        </div>
      </div>
    );
  }

  const displayName = `${user.first_name} ${user.last_name}`.trim() || user.email;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch {
      setError('Ошибка при выходе');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await updateProfile({
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
      });
      setSuccess('Профиль успешно обновлён');
      isSetEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err?.message || 'Ошибка при обновлении профиля');
      console.error('Profile update error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Новые пароли не совпадают');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Новый пароль должен быть минимум 6 символов');
      return;
    }

    setError('Смена пароля через это приложение пока не поддерживается (нет API).');
    setIsChangingPassword(false);
    setPasswordData({ newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Header />

      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-12">
        <div className="bg-gradient-to-r from-[#1B4B43] to-[#2a6b5f] rounded-2xl sm:rounded-3xl px-4 sm:px-8 py-6 sm:py-12 text-white mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full flex items-center justify-center text-3xl sm:text-5xl font-bold border-4 border-white/30 backdrop-blur flex-shrink-0">
              {user.first_name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2">{displayName}</h1>
              <p className="text-xs sm:text-base text-white/80 flex items-center gap-2 mb-2 sm:mb-3 break-all">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                {user.email}
              </p>
              {user.role === 'admin' && (
                <span className="inline-block px-3 sm:px-4 py-1 sm:py-2 bg-amber-500/20 border border-amber-500/50 rounded-full text-[10px] sm:text-xs font-semibold">
                  👑 Администратор
                </span>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 sm:mb-6 bg-red-50 border border-red-200 text-red-700 p-3 sm:p-4 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 sm:mb-6 bg-green-50 border border-green-200 text-green-700 p-3 sm:p-4 rounded-lg text-xs sm:text-sm">
            ✓ {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-6 border border-gray-100 space-y-1 sm:space-y-2">
              <Link
                to="/profile"
                className={`block w-full text-left px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-semibold text-xs sm:text-base transition-colors ${
                  location.pathname === '/profile' ? 'bg-[#1B4B43]/10 text-[#1B4B43]' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                📋 Мой профиль
              </Link>
              <Link
                to="/orders"
                className={`block w-full text-left px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-semibold text-xs sm:text-base transition-colors ${
                  location.pathname === '/orders' ? 'bg-[#1B4B43]/10 text-[#1B4B43]' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                📦 Мои заказы
              </Link>
              <Link
                to="/favorites"
                className={`block w-full text-left px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-semibold text-xs sm:text-base transition-colors ${
                  location.pathname === '/favorites' ? 'bg-[#1B4B43]/10 text-[#1B4B43]' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                ❤️ Избранное
              </Link>

              <hr className="my-2 sm:my-4" />

              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-red-500 hover:bg-red-50 transition-colors font-semibold text-xs sm:text-base"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                Выход
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-8 border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Данные профиля</h2>
                {!isEditing && (
                  <button
                    type="button"
                    onClick={() => isSetEditing(true)}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-[#1B4B43]/10 text-[#1B4B43] rounded-lg hover:bg-[#1B4B43]/20 transition-colors font-semibold text-xs sm:text-base w-fit"
                  >
                    <Edit2 className="w-4 h-4" />
                    Редактировать
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleEditSubmit} className="space-y-4 sm:space-y-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Имя</label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 sm:top-3 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.first_name}
                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4B43] focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Фамилия</label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 sm:top-3 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.last_name}
                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4B43] focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Телефон</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 sm:top-3 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+7..."
                        className="w-full pl-10 pr-4 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4B43] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 sm:gap-3 pt-2 sm:pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#1B4B43] text-white rounded-lg hover:bg-[#2a6b5f] transition-colors font-semibold disabled:opacity-50"
                    >
                      <Save className="w-5 h-5" />
                      Сохранить
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        isSetEditing(false);
                        setFormData({
                          first_name: user.first_name,
                          last_name: user.last_name,
                          phone: user.phone || '',
                        });
                      }}
                      className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                    >
                      <X className="w-5 h-5" />
                      Отмена
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">Имя</p>
                      <p className="text-lg text-gray-900 font-semibold">{displayName}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">Email</p>
                      <p className="text-lg text-gray-900 font-semibold">{user.email}</p>
                    </div>
                  </div>

                  {user.phone && (
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">Телефон</p>
                      <p className="text-gray-900 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {user.phone}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Безопасность</h2>
                {!isChangingPassword && (
                  <button
                    type="button"
                    onClick={() => setIsChangingPassword(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-semibold"
                  >
                    <Lock className="w-4 h-4" />
                    Изменить пароль
                  </button>
                )}
              </div>

              {isChangingPassword ? (
                <form onSubmit={handlePasswordChange} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Новый пароль</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        placeholder="Введите новый пароль"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4B43] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Подтвердите пароль</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        placeholder="Повторите пароль"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4B43] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                    >
                      Отправить
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsChangingPassword(false)}
                      className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                    >
                      <X className="w-5 h-5" />
                      Отмена
                    </button>
                  </div>
                </form>
              ) : (
                <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
                  <p className="text-gray-600 mb-4">Пароль хранится на сервере в зашифрованном виде.</p>
                  <p className="text-xs text-gray-500">Смена пароля через API в этой версии не подключена.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
