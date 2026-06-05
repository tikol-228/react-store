import path from 'path';
import { pathToFileURL } from 'url';
import { initDatabase, getDatabase } from './init.js';

/** Удаляет все товары из БД (корзина, отзывы и позиции заказов — каскадом). */
export async function clearAllProducts() {
  await initDatabase();
  const db = await getDatabase();

  const before = await db.get('SELECT COUNT(*) AS count FROM products');
  await db.run('DELETE FROM products');
  const after = await db.get('SELECT COUNT(*) AS count FROM products');

  await db.close();
  return { deleted: before?.count ?? 0, remaining: after?.count ?? 0 };
}

const isMainModule = () => {
  const entry = process.argv[1];
  if (!entry) return false;
  try {
    return import.meta.url === pathToFileURL(path.resolve(entry)).href;
  } catch {
    return false;
  }
};

if (isMainModule()) {
  clearAllProducts()
    .then((r) => {
      console.log(`Удалено товаров: ${r.deleted}, осталось: ${r.remaining}`);
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
