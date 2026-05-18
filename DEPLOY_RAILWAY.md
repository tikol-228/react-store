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
2. **Settings → Root Directory:** `server`
3. **Settings → Networking:** Generate Domain (публичный URL API).
4. **Variables:**

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

5. **Volume (важно для БД):**
   - **Volumes** → Create Volume → mount path **`/data`**
   - Тогда SQLite сохраняется между перезапусками.

6. Деплой: при старте создаются таблицы и выполняется **seed** (админ + товары).

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
| CORS error | `FRONTEND_URL` = точный URL web (без `/` в конце) |
| Пустой каталог | Перезапустить api (seed), проверить volume |
| API 404 на фронте | Пересобрать web с правильным `VITE_API_URL` |
| Логин не работает | Проверить `JWT_SECRET`, что api и web в одном проекте |
