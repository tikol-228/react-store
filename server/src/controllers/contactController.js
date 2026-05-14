import { body, validationResult } from 'express-validator';
import { Contact } from '../models/Contact.js';
import { AdminNotification } from '../models/AdminNotification.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// Validation rules
export const validateContact = [
  body('name').trim().isLength({ min: 1 }),
  body('email').isEmail().normalizeEmail(),
  body('message').trim().isLength({ min: 1 }),
];

// Create contact message
export const createContact = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 400;
    error.details = errors.array();
    throw error;
  }

  const contact = await Contact.create(req.body);

  // Create admin notification
  await AdminNotification.newContact(contact.id);

  res.status(201).json({
    message: 'Contact message sent successfully',
    contact
  });
});

// Get all contacts (admin only)
export const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.findAll();
  const unreadCount = await Contact.getUnreadCount();

  res.json({ contacts, unreadCount });
});

// Mark contact as read (admin only)
export const markContactAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const contact = await Contact.markAsRead(id);
  if (!contact) {
    const error = new Error('Contact not found');
    error.statusCode = 404;
    throw error;
  }

  res.json({
    message: 'Contact marked as read',
    contact
  });
});

// Delete contact (admin only)
export const deleteContact = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const contact = await Contact.findAll();
  const existingContact = contact.find(c => c.id === parseInt(id));

  if (!existingContact) {
    const error = new Error('Contact not found');
    error.statusCode = 404;
    throw error;
  }

  await Contact.delete(id);

  res.json({ message: 'Contact deleted successfully' });
});