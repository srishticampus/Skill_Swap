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

// Endpoint to update complaint status (Admin only)
router.put('/:id/status', auth, adminCheck, async (req, res) => {
  try {
    const complaintId = req.params.id;
    const { status } = req.body;

    // Validate status against enum
    const validStatuses = ['pending', 'in_progress', 'resolved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status provided.' });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      complaintId,
      { status },
      { new: true } // Return the updated document
    );

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found.' });
    }

    // Create a notification for the user who filed the complaint
    const notification = new Notification({
      user: complaint.userId,
      type: 'complaint_status_update',
      message: `Your complaint regarding "${complaint.description}" has been updated to: ${status}.`,
      status: 'unread',
    });

    await notification.save();

    res.status(200).json(complaint);
  } catch (error) {
    console.error('Error updating complaint status:', error);
    res.status(500).json({ message: 'Failed to update complaint status.', error: error.message });
  }
});

export default router;
