# Быстрый старт: Protected Routing & User Management

## ✅ Что было добавлено

### 1. **ProtectedRoute** компонент
- Защита маршрутов от неавторизованных пользователей
- Проверка прав администратора
- Автоматический редирект на страницу входа

### 2. **UserManagement** страница  
- Полный список всех пользователей
- Редактирование профилей пользователей
- Управление правами администратора
- Удаление пользователей

### 3. **Обновлённый Admin Panel**
- Новая вкладка "Пользователи" в админ-панели
- Интеграция UserManagement компонента

### 4. **Firestore Security Rules**
- Правила безопасности для всех коллекций
- Защита от несанкционированного доступа

### 5. **Документация**
- Подробное описание архитектуры
- Примеры использования
- Гайды по настройке

---

## 🚀 Быстрая настройка

### Шаг 1: Применить Firestore Rules (ОБЯЗАТЕЛЬНО!)

1. Откройте [Firebase Console](https://console.firebase.google.com/)
2. Выберите ваш проект
3. Перейдите в **Firestore Database** → **Rules**
4. Скопируйте содержимое файла `firestore.rules.txt`
5. Вставьте в редактор правил
6. Нажмите **Publish**

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // ... остальные правила
  }
}
```

### Шаг 2: Создайте первого администратора

**Способ 1 - Через Firebase Console:**
1. Firestore Database → Collection `users`
2. Найдите ваш профиль
3. Добавьте поле `isAdmin: true`

**Способ 2 - Программно (если используете функции):**
```typescript
// Это сделает вас администратором
const currentUser = auth.currentUser;
if (currentUser) {
  await updateDoc(doc(db, 'users', currentUser.uid), {
    isAdmin: true
  });
}
```

### Шаг 3: Тестируйте

```bash
npm run dev
```

Попробуйте:
- ✅ Зарегистрироваться
- ✅ Логируйтесь в систему  
- ✅ Откройте `/profile` (должно работать)
- ✅ Откройте `/admin` (редирект если не админ)
- ✅ Как админ откройте `/admin` (должно работать)

---

## 📋 Маршруты приложения

### 🟢 Публичные (для всех)
```
/ - Главная
/login - Вход
/register - Регистрация
/forgot-password - Восстановление пароля
/contacts - Контакты
```

### 🔵 Защищённые (требуют аутентификации)
```
/profile - Мой профиль
/cart - Моя корзина
/checkout - Оформление заказа
/success - Успешный заказ
```

### 🔴 Админ (требуют роль admin)
```
/admin - Админ-панель
  /admin → вкладка "Товары" - Управление товарами
  /admin → вкладка "Заказы" - История заказов
  /admin → вкладка "Пользователи" - Управление пользователями
```

---

## 💻 Использование в коде

### Получить информацию о текущем пользователе

```typescript
import { useAuth } from '../contexts/AuthContext';

export function MyComponent() {
  const { user, isLoading, login, logout } = useAuth();

  if (isLoading) return <div>Загрузка...</div>;
  
  return (
    <>
      {user ? (
        <>
          <p>Привет, {user.name}!</p>
          {user.isAdmin && <p>👑 Вы администратор</p>}
          <button onClick={logout}>Выход</button>
        </>
      ) : (
        <p>Вы не авторизованы</p>
      )}
    </>
  );
}
```

### Защитить маршрут

```typescript
// В App.tsx
import ProtectedRoute from './components/ProtectedRoute';

<Routes>
  {/* Только для авторизованных */}
  <Route 
    path="/profile" 
    element={
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    } 
  />

  {/* Только для администраторов */}
  <Route 
    path="/admin" 
    element={
      <ProtectedRoute requiredRole="admin">
        <Admin />
      </ProtectedRoute>
    } 
  />
</Routes>
```

---

## 🔧 Управление пользователями (для администраторов)

### В админ-панели

1. Откройте `/admin`
2. Перейдите на вкладку **"Пользователи"**
3. Действия:
   - 👁️ Просмотр всех пользователей
   - ✏️ Редактирование профиля (имя, email, телефон, адрес)
   - 👑 Выдача/отзыв прав администратора (иконка щита)
   - 🗑️ Удаление пользователя

### Пример изменения прав администратора

```typescript
// Выдать права администратора
const userDocRef = doc(db, 'users', userId);
await updateDoc(userDocRef, {
  isAdmin: true
});

// Отозвать права администратора
await updateDoc(userDocRef, {
  isAdmin: false
});
```

---

## 🐛 Решение проблем

### ❌ Проблема: "Permission denied" ошибка

**Решение:**
1. Откройте Firebase Console
2. Проверьте Firestore Rules (опубликованы ли?)
3. Проверьте структуру документов в Firestore
4. Убедитесь, что правила корректные

### ❌ Проблема: Не могу открыть админ-панель

**Решение:**
1. Проверьте, что `isAdmin: true` в Firestore
2. Обновите страницу (Ctrl+F5)
3. Проверьте консоль браузера (F12) на ошибки
4. Убедитесь, что вы авторизованы

### ❌ Проблема: Профиль не загружается

**Решение:**
1. Проверьте, что Firebase настроен (.env.local)
2. Проверьте консоль браузера на ошибки
3. Откройте Firestore Database → Collection `users`
4. Убедитесь, что там есть документ с вашим UID

---

## 📁 Файловая структура

```
src/
├── components/
│   └── ProtectedRoute.tsx          ← Компонент защиты маршрутов
├── contexts/
│   └── AuthContext.tsx              ← Контекст аутентификации
├── pages/
│   ├── Admin.tsx                    ← Админ-панель
│   └── UserManagement.tsx           ← Управление пользователями
├── panel/
│   └── Panel.tsx                    ← Основная админ-панель
└── App.tsx                          ← Обновлённый routing

firestore.rules.txt                 ← Firestore Security Rules
AUTHENTICATION_SETUP.md             ← Подробная документация
```

---

## 🎯 Следующие шаги

### Что можно расширить:

1. **Email верификация**
   ```typescript
   await sendEmailVerification(currentUser);
   ```

2. **Two-Factor Authentication (2FA)**
   - Используйте Firebase Extensions

3. **Социальная аутентификация**
   - Google, GitHub, Facebook логины
   ```typescript
   signInWithPopup(auth, new GoogleAuthProvider());
   ```

4. **Логирование действий администраторов**
   - Сохраняйте все изменения в отдельную коллекцию

5. **Импорт/Экспорт пользователей**
   - CSV или JSON форматы

---

## ✨ Готово!

Система защищённого routing и управления пользователями установлена и работает! 

Если возникнут вопросы, обратитесь к файлу `AUTHENTICATION_SETUP.md` для подробной информации.

**Счастливого кодирования! 🚀**
