import Contact from '../models/contact.js';
import { validationResult, body } from 'express-validator';

// Submit a contact form
export const submitContactForm = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
  body('email').trim().isEmail().withMessage('Invalid email address'),
  body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters long'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, email, message } = req.body;

      const newContact = new Contact({
        name,
        email,
        message,
      });

      await newContact.save();

      res.status(201).json({ message: 'Contact form submitted successfully!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
];

// Get all contact form submissions (for admin interface)
export const getAllContactForms = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single contact form submission by ID (for admin interface)
export const getContactFormById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: 'Contact form not found' });
    }

    res.status(200).json(contact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a contact form submission (for admin interface)
export const deleteContactForm = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: 'Contact form not found' });
    }

    res.status(200).json({ message: 'Contact form deleted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};