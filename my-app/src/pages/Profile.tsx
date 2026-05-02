import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Mail, Phone, MapPin, Lock, User, LogOut, Edit2, Save, X, AlertCircle } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, logout, updateUserProfile, updateUserPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Edit mode states
  const [isEditing, isSetEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

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

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      setError('Ошибка при выходе');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await updateUserProfile({
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      });
      setSuccess('Профиль успешно обновлён');
      isSetEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError('Ошибка при обновлении профиля');
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

    setLoading(true);

    try {
      await updateUserPassword(passwordData.newPassword);
      setSuccess('Пароль успешно изменён');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setIsChangingPassword(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      if (err.code === 'auth/requires-recent-login') {
        setError('Пожалуйста, заново войдите для безопасности');
      } else {
        setError('Ошибка при смене пароля');
      }
      console.error('Password change error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Header />
      
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-12">
        {/* Header с аватаром */}
        <div className="bg-gradient-to-r from-[#1B4B43] to-[#2a6b5f] rounded-2xl sm:rounded-3xl px-4 sm:px-8 py-6 sm:py-12 text-white mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full flex items-center justify-center text-3xl sm:text-5xl font-bold border-4 border-white/30 backdrop-blur flex-shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2">{user.name}</h1>
              <p className="text-xs sm:text-base text-white/80 flex items-center gap-2 mb-2 sm:mb-3 break-all">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                {user.email}
              </p>
              {user.isAdmin && (
                <span className="inline-block px-3 sm:px-4 py-1 sm:py-2 bg-amber-500/20 border border-amber-500/50 rounded-full text-[10px] sm:text-xs font-semibold">
                  👑 Администратор
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Notifications */}
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
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-6 border border-gray-100 space-y-1 sm:space-y-2">
              <Link
                to="/profile"
                className={`block w-full text-left px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-semibold text-xs sm:text-base transition-colors ${
                  location.pathname === '/profile'
                    ? 'bg-[#1B4B43]/10 text-[#1B4B43]'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                📋 Мой профиль
              </Link>
              <Link
                to="/orders"
                className={`block w-full text-left px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-semibold text-xs sm:text-base transition-colors ${
                  location.pathname === '/orders'
                    ? 'bg-[#1B4B43]/10 text-[#1B4B43]'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                📦 Мои заказы
              </Link>
              <Link
                to="/favorites"
                className={`block w-full text-left px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-semibold text-xs sm:text-base transition-colors ${
                  location.pathname === '/favorites'
                    ? 'bg-[#1B4B43]/10 text-[#1B4B43]'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                ❤️ Избранное
              </Link>
              
              <hr className="my-2 sm:my-4" />
              
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-red-500 hover:bg-red-50 transition-colors font-semibold text-xs sm:text-base"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                Выход
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Profile Information */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-8 border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Данные профиля</h2>
                {!isEditing && (
                  <button
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
                  {/* Name */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Имя</label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 sm:top-3 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4B43] focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Телефон</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 sm:top-3 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+375296894693"
                        className="w-full pl-10 pr-4 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4B43] focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Адрес доставки</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                      <textarea
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Введите адрес доставки"
                        rows={3}
                        className="w-full pl-10 pr-4 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4B43] focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Buttons */}
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
                      onClick={() => isSetEditing(false)}
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
                      <p className="text-lg text-gray-900 font-semibold">{user.name}</p>
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

                  {user.address && (
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">Адрес</p>
                      <p className="text-gray-900 flex items-start gap-2">
                        <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                        {user.address}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Change Password */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Безопасность</h2>
                {!isChangingPassword && (
                  <button
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

                  <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-lg text-sm">
                    Пароль должен содержать минимум 6 символов, прописные и строчные буквы, цифры
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50"
                    >
                      Изменить пароль
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
                  <p className="text-gray-600 mb-4">Ваш пароль защищен и хранится в безопасности.</p>
                  <p className="text-xs text-gray-500">
                    Последнее изменение пароля: недавно
                  </p>
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
