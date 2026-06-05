import { getDatabase } from '../db/init.js';

const productSelect = `
  SELECT p.*,
    c.name AS category_name,
    b.name AS brand_name
  FROM products p
  LEFT JOIN categories c ON p.category_id = c.id
  LEFT JOIN categories b ON p.brand_id = b.id
`;

export class Product {
  static async create(productData) {
    const db = await getDatabase();
    const {
      name,
      description,
      price,
      image_url,
      category_id,
      brand_id,
      care_type,
      skin_type,
      stock_quantity,
    } = productData;

    const result = await db.run(
      `
      INSERT INTO products (name, description, price, image_url, category_id, brand_id, care_type, skin_type, stock_quantity)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        name,
        description,
        price,
        image_url,
        category_id ?? null,
        brand_id ?? null,
        care_type ?? null,
        skin_type ?? null,
        stock_quantity,
      ]
    );

    return await this.findById(result.lastID);
  }

  static async findById(id) {
    const db = await getDatabase();
    return await db.get(`${productSelect} WHERE p.id = ?`, [id]);
  }

  static async findAll(filters = {}) {
    const db = await getDatabase();
    let query = `${productSelect} WHERE p.is_active = 1`;
    const params = [];

    if (filters.category_id) {
      query += ' AND p.category_id = ?';
      params.push(filters.category_id);
    }

    if (filters.brand_id) {
      query += ' AND p.brand_id = ?';
      params.push(filters.brand_id);
    }

    if (filters.skin_type) {
      const skinType = filters.skin_type;
      query += ` AND (
        p.skin_type = ?
        OR p.skin_type LIKE ?
        OR p.skin_type LIKE ?
        OR p.skin_type LIKE ?
        OR p.skin_type LIKE ?
      )`;
      params.push(
        skinType,
        `${skinType},%`,
        `%,${skinType},%`,
        `%,${skinType}`,
        `%"${skinType}"%`
      );
    }

    if (filters.search) {
      query += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    query += ' ORDER BY p.created_at DESC';

    if (filters.limit) {
      query += ' LIMIT ?';
      params.push(filters.limit);
    }

    if (filters.offset) {
      query += ' OFFSET ?';
      params.push(filters.offset);
    }

    return await db.all(query, params);
  }

  static async update(id, productData) {
    const db = await getDatabase();
    const existing = await this.findById(id);
    if (!existing) return null;

    const {
      name = existing.name,
      description = existing.description,
      price = existing.price,
      image_url = existing.image_url,
      category_id = existing.category_id,
      brand_id = existing.brand_id,
      care_type = existing.care_type,
      skin_type = existing.skin_type,
      stock_quantity = existing.stock_quantity,
      is_active = existing.is_active,
    } = productData;

    await db.run(
      `
      UPDATE products
      SET name = ?, description = ?, price = ?, image_url = ?,
          category_id = ?, brand_id = ?, care_type = ?, skin_type = ?,
          stock_quantity = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
      [
        name,
        description,
        price,
        image_url,
        category_id ?? null,
        brand_id ?? null,
        care_type ?? null,
        skin_type ?? null,
        stock_quantity,
        is_active,
        id,
      ]
    );

    return await this.findById(id);
  }

  static async delete(id) {
    const db = await getDatabase();
    await db.run('UPDATE products SET is_active = 0 WHERE id = ?', [id]);
  }

  static async getCount(filters = {}) {
    const db = await getDatabase();
    let query = 'SELECT COUNT(*) as count FROM products WHERE is_active = 1';
    const params = [];

    if (filters.category_id) {
      query += ' AND category_id = ?';
      params.push(filters.category_id);
    }

    if (filters.brand_id) {
      query += ' AND brand_id = ?';
      params.push(filters.brand_id);
    }

    if (filters.search) {
      query += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    const result = await db.get(query, params);
    return result.count;
  }
}
