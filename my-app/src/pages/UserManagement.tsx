import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { User } from '../contexts/AuthContext';
import { usersAPI } from '../services/api';

/** Legacy page: real user management lives in `/admin` (Panel). */
const UserManagement: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.role !== 'admin') return;
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await usersAPI.getUsers();
        if (!cancelled) setUsers(res.data.users || []);
      } catch {
        if (!cancelled) setUsers([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <p className="text-gray-700 mb-4">Управление пользователями доступно администратору в панели.</p>
          <Link to="/admin" className="text-[#1B4B43] font-semibold underline">
            Перейти в админ-панель
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
        <div className="w-12 h-12 border-4 border-[#1B4B43]/20 border-t-[#1B4B43] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-[#1A1A1A] mb-2">Пользователи (краткий список)</h1>
        <p className="text-sm text-gray-500 mb-6">
          Полное управление — в{' '}
          <Link to="/admin" className="text-[#1B4B43] font-semibold underline">
            /admin
          </Link>
          .
        </p>
        <ul className="space-y-2 bg-white rounded-xl border border-gray-100 p-4">
          {users.map((u) => (
            <li key={u.id} className="flex flex-wrap justify-between gap-2 text-sm border-b border-gray-50 last:border-0 py-2">
              <span className="font-medium">
                {u.first_name} {u.last_name}
              </span>
              <span className="text-gray-600">{u.email}</span>
              <span className="text-gray-400">{u.role}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserManagement;
