import express from "express";
import Complaint from '../../models/complaint.js';
import Notification from '../../models/notification.js'; // Import Notification model
import { verifyToken as auth } from '../auth/index.js';
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

// Endpoint to update complaint status to resolved (Admin only)
router.put('/:id/resolve', auth, adminCheck, async (req, res) => {
  try {
    const complaintId = req.params.id;
    const complaint = await Complaint.findByIdAndUpdate(
      complaintId,
      { status: 'resolved' },
      { new: true } // Return the updated document
    );

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found.' });
    }

    // Create a notification for the user who filed the complaint
    const notification = new Notification({
      user: complaint.userId, // Use 'user' instead of 'recipient'
      type: 'complaint_resolved',
      message: `Your complaint regarding "${complaint.complaintAgainst}" has been resolved by an administrator.`,
      status: 'unread', // Add the required status field
    });

    await notification.save();

    res.status(200).json(complaint);
  } catch (error) {
    console.error('Error resolving complaint:', error);
    res.status(500).json({ message: 'Failed to resolve complaint.', error: error.message });
  }
});

export default router;
