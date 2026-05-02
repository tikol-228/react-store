# 📱 Полная система аккаунтов на Firebase

## 🚀 Что было сделано:

### ✅ Аутентификация и управление аккаунтами
- **Регистрация**: Валидация пароля (6+ символов, прописные, цифры)
- **Логин**: С поддержкой восстановления пароля
- **Восстановление пароля**: Email-письма с ссылкой для сброса
- **Обновление профиля**: Редактирование данных пользователя
- **Смена пароля**: Безопасное изменение пароля
- **Выход**: Полная очистка сессии

### 🔒 Безопасность
- Пароли хранятся в Firebase (хешированные, не доступны)
- Email-подтверждение при восстановлении пароля
- Защита от массовых атак (Rate limiting от Firebase)
- Валидация данных на фронтенде и бэкенде

### 💾 Хранилище данных
- **Firestore Database**: Облачное хранилище всех данных
- **Структура**:
  ```
  users/
  ├── {userId}
  │   ├── name: string
  │   ├── email: string
  │   ├── phone: string
  │   ├── address: string
  │   ├── avatar: string
  │   ├── isAdmin: boolean
  │   └── createdAt: timestamp
  ```

### 📄 Страницы
1. **Login** (`/login`) - Вход с ошибками и ссылкой на восстановление
2. **Register** (`/register`) - Регистрация с валидацией пароля
3. **ForgotPassword** (`/forgot-password`) - Восстановление пароля
4. **Profile** (`/profile`) - Профиль пользователя (будет обновлён)
5. **Contacts** (`/contacts`) - Контактная информация

## 🔧 Установка Firebase

### 1. Создайте Firebase проект:
- Перейдите на https://console.firebase.google.com/
- Нажмите "Создать проект"
- Назовите проект (например, "art-capital-estetic")
- Согласитесь с условиями и создайте

### 2. Включите Authentication:
- В левом меню выберите "Authentication"
- Нажмите "Начать"
- Выберите "Email/Password" как способ входа
- Включите его

### 3. Создайте Firestore Database:
- В левом меню выберите "Firestore Database"
- Нажмите "Создать базу данных"
- Выберите регион (например, "eur3" для Европы)
- Выберите "Начать в режиме тестирования"

### 4. Получите конфигурационные ключи:
- Нажмите значок ⚙️ (Параметры проекта)
- Перейдите на вкладку "Приложения"
- Нажмите значок "Web" (</>)
- Скопируйте конфиг (firebaseConfig)
- Вставьте значения в файл `.env`

### 5. Установите зависимость:
```bash
cd my-app
npm install firebase
```

### 6. Заполните .env файл:
```
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
```

**Важно:** Используйте префикс `VITE_` для переменных окружения в Vite (не `REACT_APP_`)

### 7. Запустите приложение:
```bash
npm run dev
```

## 🔐 Firestore Security Rules (Важно!)

Добавьте эти правила безопасности в Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Пользователи могут читать/писать только свой профиль
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Публичные данные (товары и т.д.)
    match /products/{document=**} {
      allow read: if true;
      allow write: if request.auth.uid != null && 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Заказы - только свои
    match /orders/{document=**} {
      allow read, write: if request.auth.uid != null &&
                           resource.data.userId == request.auth.uid;
    }
  }
}
```

## 🎯 Как использовать в компонентах

```typescript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, login, logout, resetPassword } = useAuth();
  
  return (
    <>
      {user && <p>Добро пожаловать, {user.name}!</p>}
      <button onClick={logout}>Выход</button>
    </>
  );
}
```

## 📊 Интеграция в профиль

Обновите `/profile` страницу для:
- Отображения данных пользователя
- Редактирования профиля
- Смены пароля
- Загрузки аватара

## 🚨 Важные моменты

1. **Email подтверждение**: Добавьте в Firebase Console → Authentication → Templates
2. **Пароли**: Никогда не передавайте пароль через API (Firebase заботится об этом)
3. **Сессии**: Пользователь будет автоматически заходить при перезагрузке
4. **Ошибки**: Все ошибки Firebase переводятся на русский язык

## 🔐 Дополнительная безопасность

Рекомендуется добавить:
- Email подтверждение при регистрации
- 2FA (двухфакторная аутентификация)
- Логирование входов
- Ограничение времени жизни сессии

Всё готово к использованию! 🎉
