import { getDatabase } from '../database/init.js';

export class Contact {
  static async create(contactData) {
    const db = await getDatabase();
    const { name, email, phone, message } = contactData;

    const result = await db.run(`
      INSERT INTO contacts (name, email, phone, message)
      VALUES (?, ?, ?, ?)
    `, [name, email, phone, message]);

    return { id: result.lastID, name, email, phone, message, is_read: 0 };
  }

  static async findAll() {
    const db = await getDatabase();
    return await db.all('SELECT * FROM contacts ORDER BY created_at DESC');
  }

  static async markAsRead(id) {
    const db = await getDatabase();
    await db.run('UPDATE contacts SET is_read = 1 WHERE id = ?', [id]);
    return await db.get('SELECT * FROM contacts WHERE id = ?', [id]);
  }

  static async delete(id) {
    const db = await getDatabase();
    await db.run('DELETE FROM contacts WHERE id = ?', [id]);
  }

  static async getUnreadCount() {
    const db = await getDatabase();
    const result = await db.get('SELECT COUNT(*) as count FROM contacts WHERE is_read = 0');
    return result.count;
  }
}