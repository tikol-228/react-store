import express from 'express';
import {
  createContact,
  getContacts,
  markContactAsRead,
  deleteContact,
  validateContact
} from '../controllers/contactController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/', validateContact, createContact);

// Admin routes
router.get('/', authenticate, requireAdmin, getContacts);
router.patch('/:id/read', authenticate, requireAdmin, markContactAsRead);
router.delete('/:id', authenticate, requireAdmin, deleteContact);

export default router;