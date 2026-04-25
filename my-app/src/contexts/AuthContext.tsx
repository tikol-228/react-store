import React, { createContext, useState, useEffect, useContext } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser,
  updateEmail,
  updatePassword,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

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
  firebaseUser: FirebaseUser | null;
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
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Слушаем изменения аутентификации
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUserData) => {
      try {
        if (firebaseUserData) {
          setFirebaseUser(firebaseUserData);
          // Получаем дополнительные данные пользователя из Firestore
          const userDocRef = doc(db, 'users', firebaseUserData.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            setUser({
              id: firebaseUserData.uid,
              ...userDocSnap.data() as Omit<User, 'id'>,
            });
          } else {
            // Если документа нет, создаём минимальный профиль
            setUser({
              id: firebaseUserData.uid,
              name: firebaseUserData.displayName || 'Пользователь',
              email: firebaseUserData.email || '',
            });
          }
        } else {
          setUser(null);
          setFirebaseUser(null);
        }
      } catch (error) {
        console.error('Ошибка при загрузке профиля:', error);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Регистрация
  const register = async (name: string, email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUserData = userCredential.user;

      // Обновляем профиль с именем
      await updateProfile(firebaseUserData, {
        displayName: name,
      });

      // Сохраняем данные в Firestore
      const userDocRef = doc(db, 'users', firebaseUserData.uid);
      await setDoc(userDocRef, {
        name,
        email,
        isAdmin: false,
        createdAt: new Date().toISOString(),
        phone: '',
        address: '',
        avatar: '',
      });

      // Обновляем локальное состояние
      setUser({
        id: firebaseUserData.uid,
        name,
        email,
        isAdmin: false,
      });
    } catch (error) {
      throw error;
    }
  };

  // Логин
  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUserData = userCredential.user;

      // Получаем данные из Firestore
      const userDocRef = doc(db, 'users', firebaseUserData.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        setUser({
          id: firebaseUserData.uid,
          ...userDocSnap.data() as Omit<User, 'id'>,
        });
      }
    } catch (error) {
      throw error;
    }
  };

  // Выход
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setFirebaseUser(null);
    } catch (error) {
      throw error;
    }
  };

  // Восстановление пароля
  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw error;
    }
  };

  // Обновление профиля
  const updateUserProfile = async (updates: Partial<User>) => {
    if (!firebaseUser) throw new Error('Пользователь не авторизован');

    try {
      // Обновляем в Firestore
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      await updateDoc(userDocRef, {
        ...updates,
      });

      // Если обновляем email через Firebase Auth
      if (updates.email && updates.email !== firebaseUser.email) {
        await updateEmail(firebaseUser, updates.email);
      }

      // Если обновляем имя
      if (updates.name) {
        await updateProfile(firebaseUser, {
          displayName: updates.name,
        });
      }

      // Обновляем локальное состояние
      setUser((prevUser) => prevUser ? { ...prevUser, ...updates } : null);
    } catch (error) {
      throw error;
    }
  };

  // Обновление пароля
  const updateUserPassword = async (newPassword: string) => {
    if (!firebaseUser) throw new Error('Пользователь не авторизован');

    try {
      await updatePassword(firebaseUser, newPassword);
    } catch (error) {
      throw error;
    }
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
