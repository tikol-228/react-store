/** Какой подпроект запускать при деплое из корня репозитория (Railway). */
export function resolveRailwayAppTarget() {
  const explicit = process.env.RAILWAY_ROOT_APP?.trim().toLowerCase();
  if (explicit === 'server' || explicit === 'api') return 'server';
  if (explicit === 'my-app' || explicit === 'web' || explicit === 'client') return 'my-app';

  const service = (process.env.RAILWAY_SERVICE_NAME || '').toLowerCase();
  if (service.includes('api') || service.includes('backend')) return 'server';

  return 'my-app';
}
