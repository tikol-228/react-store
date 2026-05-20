# Деплой на Railway (API + фронт + SQLite)

Два сервиса в одном проекте Railway: **api** (бэкенд) и **web** (фронт).

## 1. Подготовка

```bash
cd react-store
npm install
npm run railway -- login
```

Без глобальной установки можно так: `npx @railway/cli login`

Репозиторий должен быть в Git (GitHub) или деплой через `railway up` из папок.

## 2. Создать проект

```bash
cd react-store
railway init
```

## 3. Сервис **api** (бэкенд)

1. В Railway: **New Service** → **GitHub Repo** (или Empty + `railway up` из `server/`).
2. **Settings → Root Directory:** `server` (обязательно; иначе пути вида `/app/server/...` и падение `init.js`)
3. **Settings → Start Command:** `node src/server.js` (или пусто — возьмётся из `server/railway.toml`)
4. **Settings → Networking:** Generate Domain (публичный URL API).
5. **Variables:**

| Переменная | Значение |
|------------|----------|
| `NODE_ENV` | `production` |
| `JWT_SECRET` | длинная случайная строка |
| `JWT_EXPIRES_IN` | `7d` |
| `ADMIN_EMAIL` | `admin@store.com` |
| `ADMIN_PASSWORD` | ваш пароль админа |
| `ADMIN_PANEL_PIN` | PIN для `/admin` (или пусто) |
| `DB_PATH` | `/data/store.db` |
| `FRONTEND_URL` | URL фронта (после деплоя web), напр. `https://web-xxx.up.railway.app` |

6. **Volume (важно для БД):**
   - **Volumes** → Create Volume → mount path **`/data`**
   - Тогда SQLite сохраняется между перезапусками.

7. Деплой: при старте создаются таблицы и выполняется **seed** (админ + товары).

Проверка: `https://<api-domain>/api/health` → `{"status":"OK",...}`

## 4. Сервис **web** (фронт)

1. **New Service** в том же проекте.
2. **Root Directory:** `my-app`
3. **Variables** (нужны на этапе **build**):

| Переменная | Значение |
|------------|----------|
| `VITE_API_URL` | `https://<api-domain>/api` |

В Railway можно подставить ссылку на другой сервис (если сервис api назван `api`):

```
VITE_API_URL=https://${{api.RAILWAY_PUBLIC_DOMAIN}}/api
```

4. **Networking:** Generate Domain для фронта.
5. Вернитесь в сервис **api** и обновите `FRONTEND_URL` на URL фронта → **Redeploy api**.

## 5. Деплой из CLI (без GitHub)

```bash
# API
cd server
railway link   # выбрать проект и сервис api
railway up

# Web
cd ../my-app
railway link   # сервис web
railway up
```

## 6. Вход после деплоя

- Сайт: URL сервиса **web**
- Админ: `/admin`
- Логин: `ADMIN_EMAIL` / `ADMIN_PASSWORD`
- PIN панели: `ADMIN_PANEL_PIN` (если задан)

## 7. Проверка БД

Локально (если скачали volume или тест локально):

```bash
sqlite3 server/database/store.db "SELECT id, email, role FROM users;"
sqlite3 server/database/store.db "SELECT COUNT(*) FROM products;"
```

На Railway данные лежат в volume по пути `/data/store.db` внутри контейнера api.

## 8. Частые проблемы

| Проблема | Решение |
|----------|---------|
| `Cannot find package 'bcryptjs'` | Сервис **api** должен иметь **Root Directory = `server`**, Start: `node src/server.js`. Не деплойте API из корня с dev-скриптом `concurrently`. |
| CORS / 502 на login | API не запущен — смотрите логи api. После фикса деплоя: `FRONTEND_URL=https://web-production-acff8.up.railway.app` |
| `Cannot find module .../database/init.js` | Старый деплой или Root Directory api = корень репо. Код БД в `server/src/db/`. Лучше: Root Directory = `server`, Start = `node src/server.js`. Передеплой: `npm run deploy:api` |
| CORS error | `FRONTEND_URL` = точный URL web (без `/` в конце) |
| Пустой каталог | Перезапустить api (seed), проверить volume |
| API 404 на фронте | Пересобрать web с правильным `VITE_API_URL` |
| Логин не работает | Проверить `JWT_SECRET`, что api и web в одном проекте |

### Важно: настройки сервиса api в Railway

| Поле | Значение |
|------|----------|
| Root Directory | `server` |
| Build Command | `npm ci --omit=dev` (или пусто — возьмётся из `server/railway.toml`) |

## CLI: `operation timed out` при `railway up`

Частая причина — загрузка всего репозитория с `node_modules` (сотни МБ). В проекте:

- `npm run deploy:web` — деплой только из папки `my-app/`
- `npm run deploy:api` — только из `server/`
- файлы `.railwayignore` исключают `node_modules`, `dist`, БД и логи

Повторите деплой при стабильном интернете (без VPN, если он режет upload). Альтернатива — деплой из GitHub в Dashboard Railway (Settings → Connect Repo).
| Start Command | `node src/server.js` |
| Healthcheck | `/api/health` |
