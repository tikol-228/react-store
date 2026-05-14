import { getDatabase } from '../database/init.js';

export class AdminNotification {
  static async create(notificationData) {
    const db = await getDatabase();
    const { type, message, related_id } = notificationData;

    const result = await db.run(`
      INSERT INTO admin_notifications (type, message, related_id)
      VALUES (?, ?, ?)
    `, [type, message, related_id]);

    return { id: result.lastID, type, message, related_id, is_read: 0 };
  }

  static async findAll() {
    const db = await getDatabase();
    return await db.all('SELECT * FROM admin_notifications ORDER BY created_at DESC');
  }

  static async markAsRead(id) {
    const db = await getDatabase();
    await db.run('UPDATE admin_notifications SET is_read = 1 WHERE id = ?', [id]);
    return await db.get('SELECT * FROM admin_notifications WHERE id = ?', [id]);
  }

  static async delete(id) {
    const db = await getDatabase();
    await db.run('DELETE FROM admin_notifications WHERE id = ?', [id]);
  }

  static async getUnreadCount() {
    const db = await getDatabase();
    const result = await db.get('SELECT COUNT(*) as count FROM admin_notifications WHERE is_read = 0');
    return result.count;
  }

  // Specific notification creators
  static async newOrder(orderId) {
    return await this.create({
      type: 'order',
      message: `New order #${orderId} has been placed`,
      related_id: orderId
    });
  }

  static async newContact(contactId) {
    return await this.create({
      type: 'contact',
      message: 'New contact form submission received',
      related_id: contactId
    });
  }
}