import express from "express";
import Complaint from '../../models/complaint.js';
import { auth } from '../auth/index.js';
import { adminCheck } from './middleware.js'; // Import adminCheck middleware

const router = express.Router();

// Endpoint to get all complaints (Admin only)
router.get('/',auth, adminCheck, async (req, res) => {
  try {
    const complaints = await Complaint.find().populate('userId', 'name email'); // Populate userId to get user details
    res.status(200).json(complaints);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ message: 'Failed to fetch complaints.', error: error.message });
  }
});

export default router;