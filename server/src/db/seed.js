import bcrypt from 'bcryptjs';
import path from 'path';
import { pathToFileURL } from 'url';
import { initDatabase, getDatabase } from './init.js';
import { LEGACY_CATEGORY_NAMES, STORE_CATEGORY_NAMES } from '../constants/storeCategories.js';
import { STORE_BRAND_NAMES } from '../constants/storeBrands.js';

function isAllowedCatalogName(name) {
  return STORE_CATEGORY_NAMES.includes(name) || STORE_BRAND_NAMES.includes(name);
}

async function cleanupCategories(db) {
  for (const name of LEGACY_CATEGORY_NAMES) {
    await db.run('DELETE FROM categories WHERE name = ?', [name]);
  }

  const duplicateNames = await db.all(`
    SELECT name FROM categories GROUP BY name HAVING COUNT(*) > 1
  `);
  for (const { name } of duplicateNames) {
    const rows = await db.all(
      'SELECT id FROM categories WHERE name = ? ORDER BY id ASC',
      [name]
    );
    const keepId = rows[0]?.id;
    for (let i = 1; i < rows.length; i++) {
      await db.run('UPDATE products SET category_id = ? WHERE category_id = ?', [
        keepId,
        rows[i].id,
      ]);
      await db.run('DELETE FROM categories WHERE id = ?', [rows[i].id]);
    }
  }

  const all = await db.all('SELECT id, name FROM categories');
  for (const row of all) {
    if (!isAllowedCatalogName(row.name)) {
      await db.run('UPDATE products SET category_id = NULL WHERE category_id = ?', [
        row.id,
      ]);
      await db.run('DELETE FROM categories WHERE id = ?', [row.id]);
    }
  }
}

export const seedDatabase = async () => {
  await initDatabase();
  const db = await getDatabase();

  try {
    // Seed admin user
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
    await db.run(`
      INSERT OR IGNORE INTO users (email, password, first_name, last_name, role)
      VALUES (?, ?, 'Admin', 'User', 'admin')
    `, [process.env.ADMIN_EMAIL || 'admin@store.com', hashedPassword]);

    await cleanupCategories(db);

    // Seed categories (idempotent by name)
    const categories = [
      { name: 'Уход за лицом', description: 'Косметика и средства для ухода за кожей лица' },
      { name: 'Уход за телом', description: 'Средства для ухода за кожей тела' },
      { name: 'Средства SPF', description: 'Солнцезащитные средства для лица и тела' },
      { name: 'Наборы', description: 'Готовые наборы косметики для ухода' },
    ];

    const brands = [
      { name: 'DIBI Milano', description: 'Профессиональная косметика для лица и тела' },
      { name: 'Germaine de Capuccini', description: 'Премиальный уход и anti-age программы' },
    ];

    for (const brand of brands) {
      const existing = await db.get('SELECT id FROM categories WHERE name = ?', [brand.name]);
      if (!existing) {
        await db.run(
          `INSERT INTO categories (name, description) VALUES (?, ?)`,
          [brand.name, brand.description]
        );
      }
    }

    for (const category of categories) {
      const existing = await db.get('SELECT id FROM categories WHERE name = ?', [category.name]);
      if (!existing) {
        await db.run(`
          INSERT INTO categories (name, description)
          VALUES (?, ?)
        `, [category.name, category.description]);
      }
    }

    // Товары не сидируются — добавляются через админ-панель

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await db.close();
  }
};

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
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}