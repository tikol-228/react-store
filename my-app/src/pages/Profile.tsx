import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    // В реальном приложении можно редиректить в useEffect, но для простоты так
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Пожалуйста, войдите в аккаунт</h2>
          <Link to="/login" className="text-[#1B4B43] hover:underline">Перейти ко входу</Link>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-[#1B4B43] px-8 py-12 text-white">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold border-4 border-white/30">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <p className="text-white/70">{user.email}</p>
                {user.isAdmin && (
                  <span className="mt-2 inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-medium border border-white/30">
                    Администратор
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Sidebar */}
              <div className="md:col-span-1 border-r border-gray-100 pr-8">
                <nav className="space-y-1">
                  <button className="w-full text-left px-4 py-3 rounded-lg bg-gray-50 text-[#1B4B43] font-medium">
                    Мой профиль
                  </button>
                  <button className="w-full text-left px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition">
                    Мои заказы
                  </button>
                  <button className="w-full text-left px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition">
                    Избранное
                  </button>
                  <button className="w-full text-left px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition">
                    Адреса доставки
                  </button>
                  {user.isAdmin && (
                    <Link to="/admin" className="block w-full text-left px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition">
                      Управление магазином
                    </Link>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition"
                  >
                    Выйти
                  </button>
                </nav>
              </div>

              {/* Main Content */}
              <div className="md:col-span-2">
                <h3 className="text-xl font-bold mb-6">Данные аккаунта</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-1">Имя</label>
                      <p className="text-gray-900 font-medium">{user.name}</p>
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gray-400 font-bold mb-1">Email</label>
                      <p className="text-gray-900 font-medium">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-gray-100">
                    <h4 className="font-bold mb-4">История заказов</h4>
                    <div className="bg-gray-50 rounded-xl p-8 text-center text-gray-400">
                      <p>У вас пока нет заказов</p>
                      <Link to="/" className="mt-4 inline-block text-[#1B4B43] font-medium hover:underline">
                        Перейти к покупкам
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
