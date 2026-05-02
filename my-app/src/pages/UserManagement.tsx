import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Users, Shield, Trash2, Edit2, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { User } from '../contexts/AuthContext';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<User>>({});
  const { user: currentUser } = useAuth();

  // Загрузить всех пользователей
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const usersRef = collection(db, 'users');
      const q = query(usersRef);
      const snapshot = await getDocs(q);
      
      const usersList: User[] = [];
      snapshot.forEach((doc) => {
        usersList.push({
          id: doc.id,
          ...doc.data() as Omit<User, 'id'>,
        });
      });
      
      setUsers(usersList.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      }));
    } catch (err) {
      setError('Ошибка при загрузке пользователей');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditFormData(user);
    setIsEditModalOpen(true);
  };

  const handleSaveUser = async () => {
    if (!selectedUser) return;

    try {
      const userDocRef = doc(db, 'users', selectedUser.id);
      await updateDoc(userDocRef, editFormData);
      
      // Обновляем локальный список
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...editFormData } : u));
      setIsEditModalOpen(false);
      setSelectedUser(null);
    } catch (err) {
      setError('Ошибка при обновлении пользователя');
      console.error(err);
    }
  };

  const handleToggleAdmin = async (user: User) => {
    try {
      const userDocRef = doc(db, 'users', user.id);
      await updateDoc(userDocRef, {
        isAdmin: !user.isAdmin,
      });
      
      setUsers(users.map(u => 
        u.id === user.id ? { ...u, isAdmin: !u.isAdmin } : u
      ));
    } catch (err) {
      setError('Ошибка при обновлении статуса администратора');
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Вы уверены, что хотите удалить этого пользователя?')) return;

    try {
      // Удаляем из Firestore
      const userDocRef = doc(db, 'users', userId);
      await deleteDoc(userDocRef);
      
      // Удаляем из локального списка
      setUsers(users.filter(u => u.id !== userId));
    } catch (err) {
      setError('Ошибка при удалении пользователя');
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#1B4B43]/20 border-t-[#1B4B43] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Загрузка пользователей...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Users size={32} className="text-[#1B4B43]" />
            <h1 className="text-4xl font-bold text-[#1A1A1A]">Управление пользователями</h1>
          </div>
          <p className="text-gray-400">Всего пользователей: <span className="font-bold text-[#1B4B43]">{users.length}</span></p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700">
            {error}
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
          {users.length === 0 ? (
            <div className="text-center py-20">
              <Users size={40} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-400">Пользователей не найдено</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-[#FAF9F6]">
                    <th className="text-left py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Пользователь</th>
                    <th className="text-left py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Email</th>
                    <th className="text-left py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Телефон</th>
                    <th className="text-left py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Адрес</th>
                    <th className="text-left py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Статус</th>
                    <th className="text-left py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Дата регистрации</th>
                    <th className="text-right py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-[#FAF9F6] transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#1B4B43]/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="font-bold text-[#1B4B43] text-sm">
                              {user.name?.charAt(0).toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div>
                            <p className="font-bold text-[#1A1A1A]">{user.name}</p>
                            <p className="text-xs text-gray-400">{user.id.slice(0, 8)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail size={14} className="text-gray-400" />
                          {user.email}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          {user.phone ? (
                            <>
                              <Phone size={14} className="text-gray-400" />
                              {user.phone}
                            </>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          {user.address ? (
                            <>
                              <MapPin size={14} className="text-gray-400" />
                              {user.address}
                            </>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          {user.isAdmin ? (
                            <div className="flex items-center gap-1 bg-purple-50 text-purple-600 px-3 py-1 rounded-full text-xs font-bold">
                              <Shield size={12} />
                              Admin
                            </div>
                          ) : (
                            <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">
                              User
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar size={14} className="text-gray-400" />
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString('ru-RU') : '—'}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="Редактировать"
                          >
                            <Edit2 size={16} />
                          </button>
                          {user.id !== currentUser?.id && (
                            <>
                              <button
                                onClick={() => handleToggleAdmin(user)}
                                className={`p-2 rounded-lg transition-all ${
                                  user.isAdmin 
                                    ? 'text-purple-600 hover:bg-purple-50' 
                                    : 'text-gray-400 hover:text-purple-600 hover:bg-purple-50'
                                }`}
                                title={user.isAdmin ? 'Убрать права администратора' : 'Дать права администратора'}
                              >
                                <Shield size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                title="Удалить пользователя"
                              >
                                <Trash2 size={16} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-[24px] p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-6 text-[#1A1A1A]">Редактировать пользователя</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Имя</label>
                <input
                  type="text"
                  value={editFormData.name || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full bg-[#FAF9F6] border-none rounded-xl p-3 focus:ring-2 focus:ring-[#1B4B43]/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Email</label>
                <input
                  type="email"
                  value={editFormData.email || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  className="w-full bg-[#FAF9F6] border-none rounded-xl p-3 focus:ring-2 focus:ring-[#1B4B43]/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Телефон</label>
                <input
                  type="tel"
                  value={editFormData.phone || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  className="w-full bg-[#FAF9F6] border-none rounded-xl p-3 focus:ring-2 focus:ring-[#1B4B43]/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Адрес</label>
                <input
                  type="text"
                  value={editFormData.address || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                  className="w-full bg-[#FAF9F6] border-none rounded-xl p-3 focus:ring-2 focus:ring-[#1B4B43]/20 transition-all"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="flex-1 py-3 px-4 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-all"
              >
                Отмена
              </button>
              <button
                onClick={handleSaveUser}
                className="flex-1 py-3 px-4 rounded-xl bg-[#1B4B43] text-white font-bold hover:bg-[#2a6b5f] transition-all"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
