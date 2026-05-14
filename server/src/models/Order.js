import { getDatabase } from '../database/init.js';

export class Order {
  static async create(orderData) {
    const db = await getDatabase();
    const { user_id, customer_name, customer_email, customer_phone, shipping_address, total_amount, comment, items } = orderData;

    const result = await db.run(`
      INSERT INTO orders (user_id, customer_name, customer_email, customer_phone, shipping_address, total_amount, comment)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [user_id, customer_name, customer_email, customer_phone, shipping_address, total_amount, comment]);

    const orderId = result.lastID;

    // Insert order items
    for (const item of items) {
      await db.run(`
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES (?, ?, ?, ?)
      `, [orderId, item.product_id, item.quantity, item.price]);

      // Update product stock
      await db.run(`
        UPDATE products
        SET stock_quantity = stock_quantity - ?
        WHERE id = ?
      `, [item.quantity, item.product_id]);
    }

    return await this.findById(orderId);
  }

  static async findById(id) {
    const db = await getDatabase();
    const order = await db.get(`
      SELECT o.*, u.email as user_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.id = ?
    `, [id]);

    if (order) {
      order.items = await db.all(`
        SELECT oi.*, p.name as product_name, p.image_url
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
      `, [id]);
    }

    return order;
  }

  static async findAll(filters = {}) {
    const db = await getDatabase();
    let query = `
      SELECT o.*, u.email as user_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
    `;
    const params = [];

    if (filters.user_id) {
      query += ' WHERE o.user_id = ?';
      params.push(filters.user_id);
    }

    if (filters.status) {
      query += filters.user_id ? ' AND' : ' WHERE';
      query += ' o.status = ?';
      params.push(filters.status);
    }

    query += ' ORDER BY o.created_at DESC';

    if (filters.limit) {
      query += ' LIMIT ?';
      params.push(filters.limit);
    }

    if (filters.offset) {
      query += ' OFFSET ?';
      params.push(filters.offset);
    }

    const orders = await db.all(query, params);

    // Add items to each order
    for (const order of orders) {
      order.items = await db.all(`
        SELECT oi.*, p.name as product_name, p.image_url
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
      `, [order.id]);
    }

    return orders;
  }

  static async updateStatus(id, status) {
    const db = await getDatabase();
    await db.run(`
      UPDATE orders
      SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [status, id]);

    return await this.findById(id);
  }

  static async delete(id) {
    const db = await getDatabase();
    // Note: This will cascade delete order_items due to foreign key constraint
    await db.run('DELETE FROM orders WHERE id = ?', [id]);
  }

  static async getCount(filters = {}) {
    const db = await getDatabase();
    let query = 'SELECT COUNT(*) as count FROM orders';
    const params = [];

    if (filters.user_id) {
      query += ' WHERE user_id = ?';
      params.push(filters.user_id);
    }

    if (filters.status) {
      query += filters.user_id ? ' AND' : ' WHERE';
      query += ' status = ?';
      params.push(filters.status);
    }

    const result = await db.get(query, params);
    return result.count;
  }
}