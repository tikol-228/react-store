import { getDatabase } from '../database/init.js';

export class Review {
  static async create(reviewData) {
    const db = await getDatabase();
    const { user_id, product_id, rating, comment } = reviewData;

    const result = await db.run(`
      INSERT INTO reviews (user_id, product_id, rating, comment)
      VALUES (?, ?, ?, ?)
    `, [user_id, product_id, rating, comment]);

    return await this.findById(result.lastID);
  }

  static async findById(id) {
    const db = await getDatabase();
    return await db.get(`
      SELECT r.*, u.first_name, u.last_name, p.name as product_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      JOIN products p ON r.product_id = p.id
      WHERE r.id = ?
    `, [id]);
  }

  static async findByProduct(productId) {
    const db = await getDatabase();
    return await db.all(`
      SELECT r.*, u.first_name, u.last_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.product_id = ?
      ORDER BY r.created_at DESC
    `, [productId]);
  }

  static async findByUser(userId) {
    const db = await getDatabase();
    return await db.all(`
      SELECT r.*, p.name as product_name
      FROM reviews r
      JOIN products p ON r.product_id = p.id
      WHERE r.user_id = ?
      ORDER BY r.created_at DESC
    `, [userId]);
  }

  static async update(id, reviewData) {
    const db = await getDatabase();
    const { rating, comment } = reviewData;

    await db.run(`
      UPDATE reviews
      SET rating = ?, comment = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [rating, comment, id]);

    return await this.findById(id);
  }

  static async delete(id) {
    const db = await getDatabase();
    await db.run('DELETE FROM reviews WHERE id = ?', [id]);
  }

  static async getAverageRating(productId) {
    const db = await getDatabase();
    const result = await db.get(`
      SELECT AVG(rating) as average, COUNT(*) as count
      FROM reviews
      WHERE product_id = ?
    `, [productId]);

    return {
      average: result.average || 0,
      count: result.count || 0
    };
  }
}