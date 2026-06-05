import path from 'path';
import { pathToFileURL } from 'url';
import { initDatabase, getDatabase } from './init.js';

export const DEMO_ORDER_PREFIX = '[DEMO]';
export const DEMO_PRODUCT_PREFIX = '[DEMO]';

/** Каталоговые товары из seed — можно удалить кнопкой «Удалить все [DEMO]». */
export const SEED_CATALOG_PRODUCTS = [
  { name: 'Увлажняющий крем для лица', description: 'Легкая формула для ежедневного ухода', price: 29.99, category_name: 'Уход за лицом', stock: 50 },
  { name: 'Сыворотка для сияния кожи', description: 'Активная сыворотка с витамином С', price: 39.99, category_name: 'Сыворотки', stock: 30 },
  { name: 'Питательная маска для лица', description: 'Интенсивный уход за кожей лица', price: 24.99, category_name: 'Маски для лица', stock: 40 },
  { name: 'Питательный крем для тела', description: 'Интенсивное питание кожи тела', price: 31.99, category_name: 'Уход за телом', stock: 45 },
  { name: 'Лосьон для тела', description: 'Увлажнение и мягкость кожи', price: 34.99, category_name: 'Лосьоны для тела', stock: 60 },
  { name: 'Скраб для тела', description: 'Деликатное отшелушивание и гладкость', price: 27.99, category_name: 'Скрабы для тела', stock: 45 },
  { name: 'Набор «Сияние лица»', description: 'Крем + сыворотка + маска', price: 79.99, category_name: 'Наборы', stock: 25 },
  { name: 'DIBI Крем Anti-Age', description: 'Профессиональный крем DIBI Milano', price: 89.99, category_name: 'DIBI Milano', stock: 20 },
  { name: 'GDC Сыворотка лифтинг', description: 'Germaine de Capuccini — лифтинг-сыворотка', price: 95.99, category_name: 'Germaine de Capuccini', stock: 18 },
];

const SEED_PRODUCT_NAMES = SEED_CATALOG_PRODUCTS.map((p) => p.name);

const DEMO_ORDERS = [
  {
    customer_name: 'Анна Козлова',
    customer_email: 'demo.face@example.com',
    customer_phone: '+375291111001',
    shipping_address: 'г. Минск, ул. Независимости 10',
    status: 'pending',
    comment: `${DEMO_ORDER_PREFIX} Уход за лицом`,
    categories: ['Уход за лицом'],
    quantities: [1],
  },
  {
    customer_name: 'Мария Сидорова',
    customer_email: 'demo.serum@example.com',
    customer_phone: '+375291111002',
    shipping_address: 'г. Минск, пр. Победителей 25',
    status: 'processing',
    comment: `${DEMO_ORDER_PREFIX} Сыворотки`,
    categories: ['Сыворотки'],
    quantities: [2],
  },
  {
    customer_name: 'Елена Новик',
    customer_email: 'demo.mask@example.com',
    customer_phone: '+375291111003',
    shipping_address: 'г. Минск, ул. Кальварийская 5',
    status: 'shipped',
    comment: `${DEMO_ORDER_PREFIX} Маски для лица`,
    categories: ['Маски для лица'],
    quantities: [1],
  },
  {
    customer_name: 'Ольга Петрова',
    customer_email: 'demo.body@example.com',
    customer_phone: '+375291111004',
    shipping_address: 'г. Минск, ул. Амураторская 4',
    status: 'delivered',
    comment: `${DEMO_ORDER_PREFIX} Уход за телом + лосьон`,
    categories: ['Уход за телом', 'Лосьоны для тела'],
    quantities: [1, 1],
  },
  {
    customer_name: 'Ирина Волкова',
    customer_email: 'demo.scrub@example.com',
    customer_phone: '+375291111005',
    shipping_address: 'г. Минск, ул. Тимирязева 12',
    status: 'pending',
    comment: `${DEMO_ORDER_PREFIX} Скрабы для тела`,
    categories: ['Скрабы для тела'],
    quantities: [1],
  },
  {
    customer_name: 'Наталья Иванова',
    customer_email: 'demo.set@example.com',
    customer_phone: '+375291111006',
    shipping_address: 'г. Минск, ком. 103 (самовывоз)',
    status: 'processing',
    comment: `${DEMO_ORDER_PREFIX} Наборы`,
    categories: ['Наборы'],
    quantities: [1],
  },
  {
    customer_name: 'Виктория Лебедева',
    customer_email: 'demo.dibi@example.com',
    customer_phone: '+375291111007',
    shipping_address: 'г. Минск, ул. Ленина 50',
    status: 'shipped',
    comment: `${DEMO_ORDER_PREFIX} Бренд DIBI Milano`,
    categories: ['DIBI Milano'],
    quantities: [1],
  },
  {
    customer_name: 'Светлана Мороз',
    customer_email: 'demo.gdc@example.com',
    customer_phone: '+375291111008',
    shipping_address: 'г. Минск, ул. Козлова 3',
    status: 'cancelled',
    comment: `${DEMO_ORDER_PREFIX} Бренд Germaine de Capuccini`,
    categories: ['Germaine de Capuccini'],
    quantities: [1],
  },
];

async function findProductByCategory(db, categoryName) {
  return db.get(
    `SELECT p.id, p.name, p.price
     FROM products p
     JOIN categories c ON p.category_id = c.id
     WHERE c.name = ? AND p.is_active = 1
     ORDER BY p.id ASC
     LIMIT 1`,
    [categoryName]
  );
}

async function insertDemoOrder(db, spec, items) {
  const total_amount = items.reduce((sum, it) => sum + it.price * it.quantity, 0);

  const result = await db.run(
    `INSERT INTO orders (
      user_id, customer_name, customer_email, customer_phone,
      shipping_address, total_amount, status, comment
    ) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?)`,
    [
      spec.customer_name,
      spec.customer_email,
      spec.customer_phone,
      spec.shipping_address,
      total_amount,
      spec.status,
      spec.comment,
    ]
  );

  const orderId = result.lastID;

  for (const item of items) {
    await db.run(
      `INSERT INTO order_items (order_id, product_id, quantity, price)
       VALUES (?, ?, ?, ?)`,
      [orderId, item.product_id, item.quantity, item.price]
    );
  }

  return { orderId, total_amount, items };
}

async function clearDemoOrdersInDb(db) {
  const rows = await db.all(`SELECT id FROM orders WHERE comment LIKE ?`, [`${DEMO_ORDER_PREFIX}%`]);
  for (const row of rows) {
    await db.run('DELETE FROM orders WHERE id = ?', [row.id]);
  }
  return rows.length;
}

export async function clearDemoProducts() {
  await initDatabase();
  const db = await getDatabase();

  const placeholders = SEED_PRODUCT_NAMES.map(() => '?').join(', ');
  const products = await db.all(
    `SELECT id FROM products
     WHERE description LIKE ?
        OR name IN (${placeholders})`,
    [`${DEMO_PRODUCT_PREFIX}%`, ...SEED_PRODUCT_NAMES]
  );

  for (const { id } of products) {
    await db.run('DELETE FROM cart WHERE product_id = ?', [id]);
    await db.run('DELETE FROM order_items WHERE product_id = ?', [id]);
    await db.run('DELETE FROM reviews WHERE product_id = ?', [id]);
    await db.run('DELETE FROM products WHERE id = ?', [id]);
  }

  await db.close();
  return products.length;
}

export async function clearDemoOrders() {
  await initDatabase();
  const db = await getDatabase();
  const count = await clearDemoOrdersInDb(db);
  await db.close();
  return count;
}

/** Удаляет все тестовые заказы и товары каталога seed. */
export async function clearAllDemoData() {
  await initDatabase();
  const db = await getDatabase();

  const ordersDeleted = await clearDemoOrdersInDb(db);

  const placeholders = SEED_PRODUCT_NAMES.map(() => '?').join(', ');
  const products = await db.all(
    `SELECT id FROM products
     WHERE description LIKE ?
        OR name IN (${placeholders})`,
    [`${DEMO_PRODUCT_PREFIX}%`, ...SEED_PRODUCT_NAMES]
  );

  for (const { id } of products) {
    await db.run('DELETE FROM cart WHERE product_id = ?', [id]);
    await db.run('DELETE FROM order_items WHERE product_id = ?', [id]);
    await db.run('DELETE FROM reviews WHERE product_id = ?', [id]);
    await db.run('DELETE FROM products WHERE id = ?', [id]);
  }

  await db.close();
  return { ordersDeleted, productsDeleted: products.length };
}

/** Создаёт тестовые заказы (без списания остатков со склада). */
export async function seedDemoOrders({ replace = true } = {}) {
  await initDatabase();
  const db = await getDatabase();

  if (replace) {
    await db.run(`DELETE FROM orders WHERE comment LIKE ?`, [`${DEMO_ORDER_PREFIX}%`]);
  }

  const created = [];

  for (const spec of DEMO_ORDERS) {
    const items = [];

    for (let i = 0; i < spec.categories.length; i++) {
      const categoryName = spec.categories[i];
      const product = await findProductByCategory(db, categoryName);
      if (!product) {
        console.warn(`[seedDemoOrders] Нет товара в категории «${categoryName}», заказ пропущен частично`);
        continue;
      }
      items.push({
        product_id: product.id,
        quantity: spec.quantities[i] ?? 1,
        price: product.price,
        product_name: product.name,
        category_name: categoryName,
      });
    }

    if (items.length === 0) {
      console.warn(`[seedDemoOrders] Пропуск заказа: ${spec.comment}`);
      continue;
    }

    const order = await insertDemoOrder(db, spec, items);
    created.push({ ...order, customer_name: spec.customer_name, status: spec.status });
  }

  await db.close();
  return { created: created.length, orders: created };
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
  seedDemoOrders()
    .then(({ created }) => {
      console.log(`Создано тестовых заказов: ${created} (помечены ${DEMO_ORDER_PREFIX})`);
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
