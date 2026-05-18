# Railway deployment task — TODO

## Plan confirmed: SQLite + Railway Volume (no code changes)

### Step 1 — Prepare server env + entry
- [ ] Check `server/package.json` start script and required env vars (JWT_SECRET, ADMIN_EMAIL/PASSWORD, ADMIN_PANEL_PIN if used, DB_PATH, PORT).

### Step 2 — Configure server Railway service
- [ ] Create Railway project/service for `server`.
- [ ] Set `DB_PATH` to mounted volume path (e.g. `/data/store.db`).
- [ ] Ensure `PORT` is set by Railway.

### Step 3 — Run seed on Railway
- [ ] Add a one-off/command step to run `npm run seed --prefix server` with same env vars.
- [ ] Verify admin user exists.

### Step 4 — Configure frontend build + env
- [ ] Create Railway service for `my-app`.
- [ ] Configure build command: `npm run build --prefix my-app`.
- [ ] Set `VITE_API_URL` to deployed server URL + `/api`.

### Step 5 — Networking & CORS validation
- [ ] Validate server responds at `/api/health`.
- [ ] Verify frontend login/products/checkout requests.

### Step 6 — Final smoke tests
- [ ] Place a test order.
- [ ] Open admin panel (pin auth) and verify dashboard.


