import { getDatabase } from '../database/init.js';
import bcrypt from 'bcryptjs';

export class User {
  static async create(userData) {
    const db = await getDatabase();
    const { email, password, first_name, last_name, phone, role = 'user' } = userData;

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.run(`
      INSERT INTO users (email, password, first_name, last_name, phone, role)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [email, hashedPassword, first_name, last_name, phone, role]);

    return { id: result.lastID, email, first_name, last_name, phone, role };
  }

  static async findByEmail(email) {
    const db = await getDatabase();
    return await db.get('SELECT * FROM users WHERE email = ?', [email]);
  }

  static async findById(id) {
    const db = await getDatabase();
    return await db.get('SELECT id, email, first_name, last_name, phone, role, created_at, updated_at FROM users WHERE id = ?', [id]);
  }

  static async findAll() {
    const db = await getDatabase();
    return await db.all('SELECT id, email, first_name, last_name, phone, role, created_at, updated_at FROM users ORDER BY created_at DESC');
  }

  static async update(id, userData) {
    const db = await getDatabase();
    const { first_name, last_name, phone } = userData;

    await db.run(`
      UPDATE users
      SET first_name = ?, last_name = ?, phone = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [first_name, last_name, phone, id]);

    return await this.findById(id);
  }

  static async delete(id) {
    const db = await getDatabase();
    await db.run('DELETE FROM users WHERE id = ?', [id]);
  }

  static async validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}