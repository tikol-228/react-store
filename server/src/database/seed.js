import bcrypt from 'bcryptjs';
import path from 'path';
import { pathToFileURL } from 'url';
import { initDatabase, getDatabase } from './init.js';

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

    // Seed categories (idempotent by name)
    const categories = [
      { name: 'Уход за лицом', description: 'Косметика и средства для ухода за кожей лица' },
      { name: 'Уход за телом', description: 'Средства для ухода за кожей тела' },
      { name: 'Сыворотки', description: 'Активные сыворотки для лица и тела' },
      { name: 'Маски для лица', description: 'Питательные и очищающие маски для лица' },
      { name: 'Лосьоны для тела', description: 'Увлажняющие и питательные лосьоны для тела' },
      { name: 'Скрабы для тела', description: 'Отшелушивающие и тонизирующие скрабы' },
    ];

    for (const category of categories) {
      const existing = await db.get('SELECT id FROM categories WHERE name = ?', [category.name]);
      if (!existing) {
        await db.run(`
          INSERT INTO categories (name, description)
          VALUES (?, ?)
        `, [category.name, category.description]);
      }
    }

    // Seed products
    const products = [
      { name: 'Увлажняющий крем для лица', description: 'Легкая формула для ежедневного ухода', price: 29.99, category_name: 'Уход за лицом', stock: 50 },
      { name: 'Сыворотка для сияния кожи', description: 'Активная сыворотка с витамином С', price: 39.99, category_name: 'Сыворотки', stock: 30 },
      { name: 'Питательная маска для лица', description: 'Интенсивный уход за кожей лица', price: 24.99, category_name: 'Маски для лица', stock: 40 },
      { name: 'Лосьон для тела', description: 'Увлажнение и мягкость кожи', price: 34.99, category_name: 'Лосьоны для тела', stock: 60 },
      { name: 'Скраб для тела', description: 'Деликатное отшелушивание и гладкость', price: 27.99, category_name: 'Скрабы для тела', stock: 45 },
    ];

    for (const product of products) {
      const category = await db.get('SELECT id FROM categories WHERE name = ?', [product.category_name]);
      if (category) {
        const row = await db.get(
          'SELECT id FROM products WHERE name = ? AND category_id = ?',
          [product.name, category.id]
        );
        if (!row) {
          await db.run(`
            INSERT INTO products (name, description, price, category_id, stock_quantity)
            VALUES (?, ?, ?, ?, ?)
          `, [product.name, product.description, product.price, category.id, product.stock]);
        }
      }
    }

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