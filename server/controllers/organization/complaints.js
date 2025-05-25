import express from "express";
import Complaint from '../../models/complaint.js';
import User from '../../models/user.js'; // Import User model
import organizationAuth from '../../middleware/organizationAuth.js'; // Assuming organization auth middleware

const router = express.Router();

// Endpoint to get all complaints for an organization's members
const getOrganizationComplaints = async (req, res) => {
  try {
    const organizationId = req.organization.id; // Assuming organization ID is available on req.organization

    // Find all users belonging to the organization
    const organizationMembers = await User.find({ organization: organizationId }).select('_id');
    const memberIds = organizationMembers.map(member => member._id);

    // Find all complaints filed by the organization members
    const complaints = await Complaint.find({ userId: { $in: memberIds } }).populate('userId', 'name profilePicture');

    res.status(200).json(complaints);
  } catch (error) {
    console.error('Error fetching organization complaints:', error);
    res.status(500).json({ message: 'Failed to fetch organization complaints.', error: error.message });
  }
};

router.get('/', organizationAuth, getOrganizationComplaints);

export default router;