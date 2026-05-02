# Примеры кода - Protected Routing & User Management

## Пример 1: Проверка авторизации в компоненте

```typescript
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export function Dashboard() {
  const { user, isLoading, logout } = useAuth();

  if (isLoading) {
    return <div className="p-8">Загрузка профиля...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="p-8">
      <h1>Добро пожаловать, {user.name}!</h1>
      
      <div className="space-y-4">
        <div>
          <strong>Email:</strong> {user.email}
        </div>
        <div>
          <strong>Телефон:</strong> {user.phone || 'Не указан'}
        </div>
        <div>
          <strong>Адрес:</strong> {user.address || 'Не указан'}
        </div>
      </div>

      {user.isAdmin && (
        <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <p className="font-bold text-purple-900">👑 Вы администратор</p>
          <p className="text-purple-700">Вам доступна админ-панель</p>
        </div>
      )}

      <button 
        onClick={logout}
        className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Выход
      </button>
    </div>
  );
}
```

---

## Пример 2: Использование ProtectedRoute

```typescript
// В App.tsx
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Profile from './pages/Profile';

function App() {
  return (
    <Routes>
      {/* Публичный маршрут */}
      <Route path="/login" element={<Login />} />
      
      {/* Защищённый маршрут - требует аутентификации */}
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />

      {/* Защищённый маршрут - только для администраторов */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute requiredRole="admin">
            <Admin />
          </ProtectedRoute>
        } 
      />

      {/* Вложенные защищённые маршруты */}
      <Route 
        path="/dashboard/*" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}
```

---

## Пример 3: Регистрация пользователя

```typescript
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Проверки
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Пароли не совпадают');
      }

      if (formData.password.length < 6) {
        throw new Error('Пароль должен быть не менее 6 символов');
      }

      // Регистрация
      await register(formData.name, formData.email, formData.password);
      
      // Редирект на профиль
      navigate('/profile');
    } catch (err: any) {
      setError(err.message || 'Ошибка регистрации');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <label className="block font-bold mb-2">Имя</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block font-bold mb-2">Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block font-bold mb-2">Пароль</label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block font-bold mb-2">Подтвердите пароль</label>
        <input
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
      </button>
    </form>
  );
}
```

---

## Пример 4: Обновление профиля пользователя

```typescript
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export function ProfileEditForm() {
  const { user, updateUserProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      await updateUserProfile(formData);
      setMessage('Профиль успешно обновлён!');
    } catch (error: any) {
      setMessage('Ошибка: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <div>
        <label className="block font-bold mb-2">Имя</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block font-bold mb-2">Телефон</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block font-bold mb-2">Адрес</label>
        <input
          type="text"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {message && (
        <div className={`p-3 rounded ${message.includes('успешно') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700 disabled:opacity-50"
      >
        {isLoading ? 'Сохранение...' : 'Сохранить профиль'}
      </button>
    </form>
  );
}
```

---

## Пример 5: Условный рендеринг для администраторов

```typescript
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export function Navigation() {
  const { user, logout } = useAuth();

  return (
    <nav className="flex gap-4 items-center">
      <Link to="/" className="hover:text-blue-600">Главная</Link>

      {user ? (
        <>
          <Link to="/profile" className="hover:text-blue-600">
            Профиль ({user.name})
          </Link>

          {/* Только для администраторов */}
          {user.isAdmin && (
            <Link 
              to="/admin" 
              className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              👑 Админ-панель
            </Link>
          )}

          <button
            onClick={logout}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Выход
          </button>
        </>
      ) : (
        <>
          <Link to="/login" className="hover:text-blue-600">Вход</Link>
          <Link to="/register" className="hover:text-blue-600">Регистрация</Link>
        </>
      )}
    </nav>
  );
}
```

---

## Пример 6: Работа с Firestore напрямую

```typescript
import { doc, updateDoc, deleteDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '../config/firebase';

// Обновить пользователя администратором
export async function setUserAsAdmin(userId: string) {
  const userDocRef = doc(db, 'users', userId);
  await updateDoc(userDocRef, {
    isAdmin: true,
  });
}

// Удалить пользователя
export async function deleteUser(userId: string) {
  const userDocRef = doc(db, 'users', userId);
  await deleteDoc(userDocRef);
}

// Получить всех администраторов
export async function getAllAdmins() {
  const usersRef = collection(db, 'users');
  const snapshot = await getDocs(usersRef);
  
  const admins = [];
  snapshot.forEach((doc) => {
    if (doc.data().isAdmin) {
      admins.push({
        id: doc.id,
        ...doc.data(),
      });
    }
  });
  
  return admins;
}
```

---

## Пример 7: Обработка ошибок аутентификации

```typescript
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (err: any) {
      // Firebase Error Codes
      const errorCode = err.code || '';
      
      let errorMessage = 'Ошибка входа';
      if (errorCode === 'auth/user-not-found') {
        errorMessage = 'Пользователь не найден';
      } else if (errorCode === 'auth/wrong-password') {
        errorMessage = 'Неверный пароль';
      } else if (errorCode === 'auth/invalid-email') {
        errorMessage = 'Неверный email';
      } else if (errorCode === 'auth/user-disabled') {
        errorMessage = 'Аккаунт отключён';
      } else if (errorCode === 'auth/too-many-requests') {
        errorMessage = 'Слишком много попыток входа. Попробуйте позже';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="max-w-md space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded">
          ❌ {error}
        </div>
      )}

      <div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль"
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Вход...' : 'Войти'}
      </button>
    </form>
  );
}
```

---

## Пример 8: Проверка прав администратора перед операцией

```typescript
import { useAuth } from '../contexts/AuthContext';

export function AdminPanel() {
  const { user } = useAuth();

  if (!user?.isAdmin) {
    return (
      <div className="p-8 bg-red-50 border border-red-200 rounded-lg">
        <h1 className="font-bold text-red-700">Доступ запрещён</h1>
        <p className="text-red-600">У вас нет прав администратора для этой страницы</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="font-bold mb-4">👑 Админ-панель</h1>
      <p>Добро пожаловать, администратор!</p>
      
      {/* Админ контент */}
    </div>
  );
}
```

---

Эти примеры демонстрируют основные сценарии работы с системой аутентификации и управления пользователями!
