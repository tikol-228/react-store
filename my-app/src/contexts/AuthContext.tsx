import { createContext, useState, useEffect, useContext } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  avatar?: string;
  isAdmin?: boolean;
  createdAt?: Date;
}

interface AuthContextType {
  user: User | null;
  firebaseUser: any | null; // Mock for compatibility
  isLoading: boolean;
  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
  updateUserPassword: (newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Загружаем пользователя из localStorage при инициализации
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setFirebaseUser({ uid: JSON.parse(savedUser).id }); // Mock firebase user
    }
    setIsLoading(false);
  }, []);

  // Регистрация (без Firebase)
  const register = async (name: string, email: string, _password: string) => {
    try {
      // Получаем существующих пользователей
      const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');

      // Проверяем, существует ли пользователь с таким email
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        throw new Error('Пользователь с таким email уже существует');
      }

      // Создаем нового пользователя
      const newUser: User = {
        id: Date.now().toString(), // Простой ID
        name,
        email,
        isAdmin: users.length === 0, // Первый пользователь - админ
        createdAt: new Date(),
        phone: '',
        address: '',
        avatar: '',
      };

      // Сохраняем пользователя
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('currentUser', JSON.stringify(newUser));

      setUser(newUser);
      setFirebaseUser({ uid: newUser.id });
    } catch (error) {
      throw error;
    }
  };

  // Логин (без Firebase)
  const login = async (email: string, _password: string) => {
    try {
      const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');

      const foundUser = users.find(u => u.email === email);
      if (!foundUser) {
        throw new Error('Пользователь не найден');
      }

      // В mock-режиме не проверяем пароль, просто логиним
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      setUser(foundUser);
      setFirebaseUser({ uid: foundUser.id });
    } catch (error) {
      throw error;
    }
  };

  // Выход
  const logout = async () => {
    try {
      localStorage.removeItem('currentUser');
      setUser(null);
      setFirebaseUser(null);
    } catch (error) {
      throw error;
    }
  };

  // Восстановление пароля (mock)
  const resetPassword = async (email: string) => {
    // В mock-режиме просто ничего не делаем
    console.log('Password reset requested for:', email);
  };

  // Обновление профиля
  const updateUserProfile = async (updates: Partial<User>) => {
    if (!user) throw new Error('Пользователь не авторизован');

    try {
      const updatedUser = { ...user, ...updates };

      // Обновляем в localStorage
      const savedUsers = localStorage.getItem('users');
      const users: User[] = savedUsers ? JSON.parse(savedUsers) : [];
      const userIndex = users.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        localStorage.setItem('users', JSON.stringify(users));
      }

      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      throw error;
    }
  };

  // Обновление пароля (mock)
  const updateUserPassword = async (_newPassword: string) => {
    // В mock-режиме просто ничего не делаем
    console.log('Password updated');
  };

  const value: AuthContextType = {
    user,
    firebaseUser,
    isLoading,
    register,
    login,
    logout,
    resetPassword,
    updateUserProfile,
    updateUserPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth должен быть использован внутри AuthProvider');
  }
  return context;
};
