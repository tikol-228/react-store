import { getDatabase } from '../database/init.js';

export class Cart {
  static async addItem(userId, productId, quantity) {
    const db = await getDatabase();

    // Check if item already exists
    const existing = await db.get(`
      SELECT * FROM cart WHERE user_id = ? AND product_id = ?
    `, [userId, productId]);

    if (existing) {
      await db.run(`
        UPDATE cart
        SET quantity = quantity + ?, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ? AND product_id = ?
      `, [quantity, userId, productId]);
    } else {
      await db.run(`
        INSERT INTO cart (user_id, product_id, quantity)
        VALUES (?, ?, ?)
      `, [userId, productId, quantity]);
    }

    return await this.getUserCart(userId);
  }

  static async updateItem(userId, productId, quantity) {
    const db = await getDatabase();

    if (quantity <= 0) {
      await db.run(`
        DELETE FROM cart WHERE user_id = ? AND product_id = ?
      `, [userId, productId]);
    } else {
      await db.run(`
        UPDATE cart
        SET quantity = ?, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ? AND product_id = ?
      `, [quantity, userId, productId]);
    }

    return await this.getUserCart(userId);
  }

  static async removeItem(userId, productId) {
    const db = await getDatabase();
    await db.run(`
      DELETE FROM cart WHERE user_id = ? AND product_id = ?
    `, [userId, productId]);

    return await this.getUserCart(userId);
  }

  static async getUserCart(userId) {
    const db = await getDatabase();
    return await db.all(`
      SELECT c.*, p.name, p.price, p.image_url, p.stock_quantity
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ? AND p.is_active = 1
      ORDER BY c.created_at
    `, [userId]);
  }

  static async clearCart(userId) {
    const db = await getDatabase();
    await db.run('DELETE FROM cart WHERE user_id = ?', [userId]);
  }

  static async getCartTotal(userId) {
    const db = await getDatabase();
    const result = await db.get(`
      SELECT SUM(c.quantity * p.price) as total
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ? AND p.is_active = 1
    `, [userId]);

    return result.total || 0;
  }
}