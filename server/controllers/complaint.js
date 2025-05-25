import express from "express";
const router = express.Router();
import Complaint from '../models/complaint.js';

// Endpoint to handle submitting a new complaint
router.post('/', async (req, res) => {
  try {
    const { complaintAgainst, description, userId } = req.body;

    // Basic validation (you might want more robust validation)
    if (!complaintAgainst || !description) {
      return res.status(400).json({ message: 'Complaint against and description are required.' });
    }

    // Create a new complaint instance
    const newComplaint = new Complaint({
      complaintAgainst,
      description,
      userId: userId,
      createdAt: new Date()
    });

    // Save the complaint to the database
    await newComplaint.save();

    console.log('Complaint submitted:', newComplaint);

    res.status(201).json({ message: 'Complaint submitted successfully!' });
  } catch (error) {
    console.error('Error submitting complaint:', error);
    res.status(500).json({ message: 'Failed to submit complaint.', error: error.message });
  }
});

export default router;