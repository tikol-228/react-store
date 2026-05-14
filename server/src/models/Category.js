import { getDatabase } from '../database/init.js';

export class Category {
  static async create(categoryData) {
    const db = await getDatabase();
    const { name, description, image_url } = categoryData;

    const result = await db.run(`
      INSERT INTO categories (name, description, image_url)
      VALUES (?, ?, ?)
    `, [name, description, image_url]);

    return { id: result.lastID, name, description, image_url };
  }

  static async findById(id) {
    const db = await getDatabase();
    return await db.get('SELECT * FROM categories WHERE id = ?', [id]);
  }

  static async findAll() {
    const db = await getDatabase();
    return await db.all('SELECT * FROM categories ORDER BY name');
  }

  static async update(id, categoryData) {
    const db = await getDatabase();
    const { name, description, image_url } = categoryData;

    await db.run(`
      UPDATE categories
      SET name = ?, description = ?, image_url = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [name, description, image_url, id]);

    return await this.findById(id);
  }

  static async delete(id) {
    const db = await getDatabase();
    await db.run('DELETE FROM categories WHERE id = ?', [id]);
  }
}