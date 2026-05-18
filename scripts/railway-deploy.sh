#!/usr/bin/env bash
# Деплой на Railway (нужен: railway login)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

RAILWAY="npx @railway/cli"
if command -v railway >/dev/null 2>&1; then
  RAILWAY="railway"
elif [ -f "$ROOT/node_modules/.bin/railway" ]; then
  RAILWAY="$ROOT/node_modules/.bin/railway"
fi

if ! $RAILWAY whoami >/dev/null 2>&1; then
  echo "Сначала: npm run railway -- login   (или: npx @railway/cli login)"
  exit 1
fi

echo "=== Деплой API (server/) ==="
echo "В Railway для сервиса api: Root Directory = server, Volume mount /data, DB_PATH=/data/store.db"
cd "$ROOT/server"
$RAILWAY up

echo ""
echo "=== Деплой Web (my-app/) ==="
echo "В Railway для сервиса web: Root Directory = my-app, VITE_API_URL=https://<api-host>/api"
cd "$ROOT/my-app"
$RAILWAY up

echo ""
echo "Готово. Подробности: DEPLOY_RAILWAY.md"
