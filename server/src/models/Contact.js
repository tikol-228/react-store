import { getDatabase } from '../database/init.js';

export class Contact {
  static async create(contactData) {
    const db = await getDatabase();
    const { name, email, phone, message, type = 'contact' } = contactData;
    const contactType = type === 'booking' ? 'booking' : 'contact';

    const result = await db.run(
      `
      INSERT INTO contacts (name, email, phone, message, type)
      VALUES (?, ?, ?, ?, ?)
    `,
      [name, email, phone || null, message, contactType]
    );

    return {
      id: result.lastID,
      name,
      email,
      phone,
      message,
      type: contactType,
      is_read: 0,
    };
  }

  static async findAll(filters = {}) {
    const db = await getDatabase();
    if (filters.type) {
      return await db.all(
        'SELECT * FROM contacts WHERE type = ? ORDER BY created_at DESC',
        [filters.type]
      );
    }
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

  static async getUnreadCount(type = null) {
    const db = await getDatabase();
    if (type) {
      const result = await db.get(
        'SELECT COUNT(*) as count FROM contacts WHERE is_read = 0 AND type = ?',
        [type]
      );
      return result.count;
    }
    const result = await db.get('SELECT COUNT(*) as count FROM contacts WHERE is_read = 0');
    return result.count;
  }
}
