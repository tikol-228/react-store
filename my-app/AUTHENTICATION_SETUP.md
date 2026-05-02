# Система аутентификации и управления пользователями

## Обзор

Система включает:
- ✅ Protected Routes (защищённые маршруты)
- ✅ Система аккаунтов пользователей в Firebase
- ✅ Управление ролями администраторов
- ✅ Firestore Security Rules для безопасности
- ✅ Управление пользователями в админ-панели

## Архитектура

### 1. AuthContext (`src/contexts/AuthContext.tsx`)
Главный контекст для управления аутентификацией и профилем пользователя.

**Функции:**
- `register(name, email, password)` - регистрация нового пользователя
- `login(email, password)` - вход в систему
- `logout()` - выход из системы
- `resetPassword(email)` - восстановление пароля
- `updateUserProfile(updates)` - обновление профиля
- `updateUserPassword(newPassword)` - изменение пароля

**Поля User:**
```typescript
{
  id: string;              // UID из Firebase Auth
  name: string;            // Имя пользователя
  email: string;           // Email
  phone?: string;          // Телефон
  address?: string;        // Адрес
  avatar?: string;         // Аватар (base64 или URL)
  isAdmin?: boolean;       // Статус администратора
  createdAt?: Date;        // Дата создания
}
```

### 2. ProtectedRoute (`src/components/ProtectedRoute.tsx`)
Компонент для защиты маршрутов приложения.

**Использование:**
```typescript
// Защищённый маршрут (требует аутентификации)
<Route 
  path="/profile" 
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  } 
/>

// Защищённый маршрут только для администраторов
<Route 
  path="/admin" 
  element={
    <ProtectedRoute requiredRole="admin">
      <Admin />
    </ProtectedRoute>
  } 
/>
```

**Функции:**
- Проверка авторизации пользователя
- Проверка роли (администратор)
- Перенаправление на страницу входа если пользователь не авторизован
- Загрузочный экран во время проверки

### 3. UserManagement (`src/pages/UserManagement.tsx`)
Страница управления пользователями в админ-панели.

**Функции:**
- Просмотр всех пользователей
- Редактирование профиля пользователя
- Управление правами администратора
- Удаление пользователей
- Сортировка по дате регистрации

### 4. Обновлённый App.tsx
Маршруты приложения с защитой:

```typescript
// Публичные маршруты (доступны всем)
<Route path="/" element={<Home />} />
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
<Route path="/contacts" element={<Contacts />} />

// Защищённые маршруты (требуют аутентификации)
<Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
<Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
<Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />

// Админ маршруты (требуют прав администратора)
<Route path="/admin" element={<ProtectedRoute requiredRole="admin"><Admin /></ProtectedRoute>} />
```

## Firestore Security Rules

### Применение правил:

1. Откройте Firebase Console (https://console.firebase.google.com/)
2. Перейдите в Firestore Database
3. Откройте вкладку "Rules"
4. Скопируйте содержимое файла `firestore.rules.txt`
5. Нажмите "Publish"

### Структура безопасности:

**users/** - Профили пользователей
- Пользователь может читать/писать свой профиль
- Администратор может читать/писать все профили

**products/** - Товары каталога
- Все могут читать товары
- Только администраторы могут создавать/редактировать

**orders/** - Заказы
- Пользователь может читать свои заказы
- Администратор может читать/обновлять все заказы

**cart/** - Корзины пользователей
- Пользователь может читать/писать только свою корзину

## Использование в компонентах

### Получение информации о пользователе:

```typescript
import { useAuth } from '../contexts/AuthContext';

export function MyComponent() {
  const { user, isLoading, logout } = useAuth();

  if (isLoading) return <div>Загрузка...</div>;

  if (!user) return <div>Не авторизован</div>;

  return (
    <div>
      <h1>Привет, {user.name}!</h1>
      {user.isAdmin && <p>Вы администратор</p>}
      <button onClick={logout}>Выход</button>
    </div>
  );
}
```

### Использование защищённого маршрута:

```typescript
import ProtectedRoute from '../components/ProtectedRoute';

// В App.tsx:
<Route 
  path="/admin" 
  element={
    <ProtectedRoute requiredRole="admin">
      <Admin />
    </ProtectedRoute>
  } 
/>
```

## Установка администратора

### Способ 1: Через Firestore Console

1. Откройте Firestore Database в Firebase Console
2. Перейдите в коллекцию `users`
3. Найдите документ нужного пользователя
4. Отредактируйте поле `isAdmin` и установите его в `true`

### Способ 2: Через админ-панель

1. Войдите в админ-панель `/admin` как администратор
2. Перейдите на вкладку "Пользователи"
3. Нажмите на иконку щита рядом с пользователем, чтобы выдать права администратора

## Структура базы данных

```
/users/{userId}
  ├── id: string
  ├── name: string
  ├── email: string
  ├── phone: string
  ├── address: string
  ├── avatar: string
  ├── isAdmin: boolean
  └── createdAt: timestamp

/products/{productId}
  ├── id: string
  ├── title: string
  ├── price: number
  ├── image: string
  ├── category: string
  ├── rating: number
  └── badge: string

/orders/{orderId}
  ├── id: string
  ├── userId: string
  ├── items: array
  ├── total: number
  ├── status: string
  ├── customer: object
  └── date: timestamp

/cart/{userId}/{cartItemId}
  ├── id: string
  ├── title: string
  ├── price: number
  ├── quantity: number
  └── ...product fields
```

## Потоки аутентификации

### Регистрация:
1. Пользователь заполняет форму регистрации
2. `register()` создаёт аккаунт в Firebase Auth
3. Данные сохраняются в Firestore коллекции `users`
4. Пользователь автоматически логируется

### Вход:
1. Пользователь вводит email и пароль
2. `login()` проверяет учётные данные в Firebase Auth
3. Загружаются данные профиля из Firestore
4. Пользователь перенаправляется на главную страницу

### Защищённые маршруты:
1. Пользователь пытается открыть защищённый маршрут
2. `ProtectedRoute` проверяет `isLoading` и `user`
3. Если пользователь не авторизован → перенаправление на `/login`
4. Если требуется `admin` роль и пользователь не администратор → перенаправление на `/`

## Шаг за шагом: Первая настройка

### 1. Убедитесь, что Firebase настроен:
```bash
# Проверьте наличие файла .env.local
cat .env.local
# Должны быть установлены переменные:
# VITE_FIREBASE_API_KEY=...
# VITE_FIREBASE_AUTH_DOMAIN=...
# и т.д.
```

### 2. Примените Firestore Rules:
- Откройте Firebase Console
- Скопируйте правила из `firestore.rules.txt`
- Опубликуйте правила

### 3. Зарегистрируйте первого администратора:
- Откройте Firestore Database
- Найдите своего пользователя в коллекции `users`
- Установите `isAdmin: true`

### 4. Протестируйте систему:
- Откройте приложение
- Зарегистрируйтесь или логируйтесь
- Переходите на различные маршруты
- Проверьте доступ к админ-панели

## Решение проблем

### Ошибка "Permission denied" при чтении профиля:
- Проверьте Firestore Rules в Firebase Console
- Убедитесь, что правила опубликованы
- Проверьте структуру документов в Firestore

### Пользователь не может получить доступ к админ-панели:
- Убедитесь, что `isAdmin: true` установлен в Firestore
- Проверьте, что пользователь авторизован
- Обновите страницу (Ctrl+F5)

### Проблемы с загрузкой профиля:
- Проверьте консоль браузера на ошибки
- Убедитесь, что Firebase инициализирован правильно
- Проверьте переменные окружения в `.env.local`

## Примечания безопасности

⚠️ **ВАЖНО:**
- Никогда не сохраняйте пароли в Firestore
- Используйте Firebase Auth для управления паролями
- Проверяйте `isAdmin` на стороне сервера перед операциями
- Регулярно проверяйте Firestore Rules на соответствие требованиям
- Используйте HTTPS для всех коммуникаций
- Регулярно обновляйте зависимости Firebase

## Полезные ссылки

- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/start)
- [Firebase React Integration](https://firebase.google.com/docs/web/setup)
