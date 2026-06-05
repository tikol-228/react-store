# React Store — интернет-магазин косметики

Full-stack интернет-магазин: React (фронт) + Node.js / Express / SQLite (API).  
Проект настроен для деплоя на **Railway** (два сервиса: `web` + `api`) и подключения **своего домена**.

**Репозиторий:** https://github.com/tikol-228/react-store

---

## Содержание

- [Возможности](#возможности)
- [Стек](#стек)
- [Структура проекта](#структура-проекта)
- [Локальный запуск](#локальный-запуск)
- [Переменные окружения](#переменные-окружения)
- [Деплой на Railway](#деплой-на-railway)
- [Деплой через GitHub](#деплой-через-github)
- [Свой домен](#свой-домен)
- [Тариф Railway](#тариф-railway)
- [Админ-панель](#админ-панель)
- [API](#api)
- [Частые проблемы](#частые-проблемы)

---

## Возможности

### Фронтенд (`my-app`)
- Каталог с фильтрами (категории, бренды, тип кожи, тип ухода)
- Корзина, избранное, оформление заказа
- Регистрация / вход (JWT + опционально Firebase)
- Личный кабинет и история заказов
- Админ-панель `/admin`
- Адаптивная вёрстка (Tailwind CSS)

### Бэкенд (`server`)
- REST API на Express
- SQLite (локально — файл, на Railway — volume)
- JWT, роли (user / admin)
- CRUD товаров, заказов, пользователей
- Seed при первом запуске (админ + каталог)

---

## Стек

| Часть | Технологии |
|-------|------------|
| Frontend | React 19, TypeScript, Vite, Tailwind, React Router, Axios |
| Backend | Node.js, Express, SQLite3, JWT, bcryptjs, Winston |
| Deploy | Railway (Railpack), GitHub |

---

## Структура проекта

```
react-store/
├── my-app/              # React-фронтенд
│   ├── src/
│   ├── railway.toml
│   └── .env.example
├── server/              # Express API + SQLite
│   ├── src/
│   ├── railway.toml
│   └── .env.example
├── scripts/             # Скрипты сборки/старта для Railway
├── DEPLOY_RAILWAY.md    # Подробный гайд по Railway
└── README.md
```

---

## Локальный запуск

### Требования
- Node.js **≥ 20**
- npm

### 1. Клонировать репозиторий

```bash
git clone https://github.com/tikol-228/react-store.git
cd react-store
npm run install-all
```

### 2. Настроить окружение

```bash
cp server/.env.example server/.env
cp my-app/.env.example my-app/.env
```

Отредактируйте `server/.env` и `my-app/.env` (см. [переменные](#переменные-окружения)).

### 3. Инициализировать БД

```bash
cd server
npm run init-db
npm run seed
```

### 4. Запустить фронт и API вместе

Из корня репозитория:

```bash
npm run dev
```

| Сервис | URL |
|--------|-----|
| Фронт | http://localhost:5173 |
| API | http://localhost:5000 |
| Health | http://localhost:5000/api/health |

---

## Переменные окружения

### Backend (`server/.env`)

| Переменная | Описание |
|------------|----------|
| `PORT` | Порт API (по умолчанию `5000`) |
| `NODE_ENV` | `development` / `production` |
| `DB_PATH` | Путь к SQLite. Локально: `./database/store.db`. Railway: `/data/store.db` |
| `JWT_SECRET` | Секрет для JWT (длинная случайная строка) |
| `JWT_EXPIRES_IN` | Срок токена, напр. `7d` |
| `ADMIN_EMAIL` | Email админа |
| `ADMIN_PASSWORD` | Пароль админа |
| `ADMIN_PANEL_PIN` | PIN для входа в `/admin` (опционально) |
| `FRONTEND_URL` | URL фронта для CORS (без `/` в конце) |
| `RUN_SEED` | `false` — не запускать seed при старте |

### Frontend (`my-app/.env`)

| Переменная | Описание |
|------------|----------|
| `VITE_API_URL` | URL API, напр. `http://localhost:5000/api` |
| `VITE_TELEGRAM_URL` | Ссылка Telegram (опционально) |
| `VITE_INSTAGRAM_URL` | Ссылка Instagram (опционально) |
| `VITE_FIREBASE_*` | Firebase Auth (если используется) |

> `VITE_*` подставляются **при сборке**. После смены URL API нужен **новый деплой web**.

---

## Деплой на Railway

Два сервиса в **одном проекте Railway**:

| Сервис | Root Directory | Start Command |
|--------|----------------|---------------|
| **api** | `server` | `node src/server.js` |
| **web** | `my-app` | `npx serve dist -s -l $PORT` |

Подробности — в [DEPLOY_RAILWAY.md](./DEPLOY_RAILWAY.md).

### Быстрый чеклист

1. [railway.com](https://railway.com) → план **Hobby** ($5/мес)
2. Создать проект → сервис **api**:
   - Root Directory: `server`
   - Generate Domain
   - Volume: mount `/data`
   - Variables: `DB_PATH=/data/store.db`, `JWT_SECRET`, `ADMIN_*`, `FRONTEND_URL`
3. Сервис **web**:
   - Root Directory: `my-app`
   - `VITE_API_URL=https://${{api.RAILWAY_PUBLIC_DOMAIN}}/api`
   - Generate Domain
4. Обновить `FRONTEND_URL` в **api** → Redeploy api
5. Проверка: `https://<api-domain>/api/health`

### Деплой из CLI

```bash
npm run deploy:login
npm run deploy:api
npm run deploy:web
```

---

## Деплой через GitHub

Автодеплой при push — рекомендуемый способ для production.

### 1. Push в GitHub

```bash
git add .
git commit -m "your message"
git push origin main
```

### 2. Подключить репозиторий в Railway

1. Railway → проект → сервис **api**
2. **Settings → Source → Connect Repo** → `tikol-228/react-store`
3. **Root Directory:** `server`
4. **Branch:** `main`
5. Повторить для сервиса **web** (Root Directory: `my-app`)

После каждого push в `main` Railway пересобирает соответствующий сервис.

### 3. Переменные

Задайте все переменные в Railway Dashboard (не коммитьте `.env` в Git).

---

## Свой домен

| Назначение | Пример |
|------------|--------|
| Сайт | `https://ваш-домен.com` |
| API | `https://api.ваш-домен.com` |

### Клиент покупает домен

1. Клиент регистрирует домен у Reg.ru / Timeweb / Cloudflare и т.д.
2. В Railway → **Networking → Custom Domain** добавить домены для **web** и **api**
3. Клиент создаёт DNS-записи (CNAME), которые покажет Railway
4. Обновить переменные:
   - **api:** `FRONTEND_URL=https://ваш-домен.com`
   - **web:** `VITE_API_URL=https://api.ваш-домен.com/api`
5. Redeploy **api** и **web**
6. Firebase → Authorized domains (если используется Firebase Auth)

---

## Тариф Railway

| План | Цена | Когда |
|------|------|-------|
| **Hobby** | $5/мес | Старт, малый магазин — **обычно хватает** |
| **Pro** | $20/мес | Стабильный overage > $10/мес, команда, production |

**Где смотреть расход:** Railway → Workspace → **Billing / Usage**.

**Оставаться на Hobby**, если usage ≤ $6–7/мес.  
**Переходить на Pro**, если счёт стабильно **$10+/мес** или нужен доступ клиенту в workspace.

Домен оплачивается **отдельно** у регистратора (~$10–15/год).

---

## Админ-панель

| | |
|---|---|
| URL | `/admin` на сайте |
| Логин | `ADMIN_EMAIL` / `ADMIN_PASSWORD` из env |
| PIN | `ADMIN_PANEL_PIN` (если задан) |

После локального seed по умолчанию: `admin@store.com` / `admin123` — **смените в production**.

---

## API

Базовый URL: `{VITE_API_URL}` (напр. `https://api.example.com/api`).

| Группа | Endpoints |
|--------|-----------|
| Auth | `POST /auth/register`, `POST /auth/login`, `GET /auth/profile` |
| Products | `GET /products`, `GET /products/:id`, CRUD (admin) |
| Categories | `GET /categories`, CRUD (admin) |
| Orders | `POST /orders`, `GET /orders`, `PATCH /orders/:id/status` |
| Cart | `GET /cart`, `POST /cart`, `PUT /cart`, `DELETE /cart` |
| Admin | `GET /admin/dashboard`, уведомления |
| Health | `GET /health` |

---

## Частые проблемы

| Проблема | Решение |
|----------|---------|
| CORS / login error | `FRONTEND_URL` = точный URL сайта, без `/` в конце |
| Пустой каталог / 404 API | Пересобрать **web** с правильным `VITE_API_URL` |
| `Route not found` на сайте | Root Directory **web** = `my-app`, не корень репо |
| API не стартует | Root Directory **api** = `server`, Start = `node src/server.js` |
| БД сбрасывается | Volume на `/data`, `DB_PATH=/data/store.db` |
| `operation timed out` при CLI | `npm run deploy:api` / `deploy:web` или деплой через GitHub |

---

## Скрипты (корень)

| Команда | Описание |
|---------|----------|
| `npm run dev` | API + фронт локально |
| `npm run install-all` | Установить зависимости везде |
| `npm run deploy:api` | Деплой API через Railway CLI |
| `npm run deploy:web` | Деплой фронта через Railway CLI |
| `npm run deploy:login` | Вход в Railway CLI |

---

## Лицензия

MIT
