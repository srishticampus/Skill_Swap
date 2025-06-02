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

// Endpoint to update the status of a complaint
const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['pending', 'in_progress', 'resolved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status provided.' });
    }

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found.' });
    }

    // Optional: Add logic to ensure the organization has permission to update this specific complaint
    // For example, check if the complaint's userId belongs to the organization's members
    const organizationId = req.organization.id;
    const organizationMembers = await User.find({ organization: organizationId }).select('_id');
    const memberIds = organizationMembers.map(member => member._id.toString());

    if (!memberIds.includes(complaint.userId.toString())) {
      return res.status(403).json({ message: 'Unauthorized to update this complaint.' });
    }

    complaint.status = status;
    await complaint.save();

    res.status(200).json({ message: 'Complaint status updated successfully.', complaint });
  } catch (error) {
    console.error('Error updating complaint status:', error);
    res.status(500).json({ message: 'Failed to update complaint status.', error: error.message });
  }
};

router.get('/', organizationAuth, getOrganizationComplaints);
router.put('/:id/status', organizationAuth, updateComplaintStatus);

export default router;
