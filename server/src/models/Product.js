import { getDatabase } from '../database/init.js';

export class Product {
  static async create(productData) {
    const db = await getDatabase();
    const { name, description, price, image_url, category_id, stock_quantity } = productData;

    const result = await db.run(`
      INSERT INTO products (name, description, price, image_url, category_id, stock_quantity)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [name, description, price, image_url, category_id, stock_quantity]);

    return await this.findById(result.lastID);
  }

  static async findById(id) {
    const db = await getDatabase();
    return await db.get(`
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `, [id]);
  }

  static async findAll(filters = {}) {
    const db = await getDatabase();
    let query = `
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = 1
    `;
    const params = [];

    if (filters.category_id) {
      query += ' AND p.category_id = ?';
      params.push(filters.category_id);
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
    const { name, description, price, image_url, category_id, stock_quantity, is_active } = productData;

    await db.run(`
      UPDATE products
      SET name = ?, description = ?, price = ?, image_url = ?, category_id = ?, stock_quantity = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [name, description, price, image_url, category_id, stock_quantity, is_active, id]);

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

    if (filters.search) {
      query += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    const result = await db.get(query, params);
    return result.count;
  }
}