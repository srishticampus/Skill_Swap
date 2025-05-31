
import express from "express";
import User from "../../models/user.js"; // Assuming this path is correct
import SwapModel from "../../models/swap_request.js"; // Assuming this path is correct
import MentorRequest from "../../models/mentor_request.js"; // Assuming this path is correct
import Organization from "../../models/organization.js"; // Assuming this path is correct
import { verifyToken as auth } from "../auth/index.js"; // Authentication middleware
import { adminCheck } from "./middleware.js"; // Assuming this path is correct

const router = express.Router();

// @route   GET /api/admin/stats/users/total
// @desc    Get total number of users (Admin only)
// @access  Private (Requires authentication and admin role)
router.get("/users/total", auth, adminCheck, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    res.json({ totalUsers });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/stats/requests/overview
// @desc    Get overview of mentor request statuses (Total, Approved, Pending)
// @access  Private (Requires authentication, likely admin check)
// Note: Using /api/stats prefix as it might not be exclusively admin in a larger app
router.get("/requests/overview", auth, adminCheck, async (req, res) => {
    try {
        const totalRequests = await MentorRequest.countDocuments();
        const approvedRequests = await MentorRequest.countDocuments({ status: 'approved' });
        const pendingRequests = await MentorRequest.countDocuments({ status: 'pending' });
        const rejectedRequests = await MentorRequest.countDocuments({ status: 'rejected' }); // Include rejected for completeness

        res.json({
            totalRequests,
            approvedRequests,
            pendingRequests,
            rejectedRequests // Added rejected count
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// TODO: Implement endpoint for Total Swaps (requires understanding of Swap/Exchange model)
// @route   GET /api/admin/stats/swaps/total
// @desc    Get total number of swaps (Admin only)
// @access  Private (Requires authentication and admin role)
router.get("/swaps/total", auth, adminCheck, async (req, res) => {
  try {
    // Need to query the relevant model for swaps
    const totalSwaps = await SwapModel.countDocuments();
    res.json({ totalSwaps });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});


export default router;
