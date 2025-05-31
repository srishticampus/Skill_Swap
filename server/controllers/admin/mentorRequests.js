import express from "express";
import { check, validationResult } from "express-validator";
import MentorRequest from "../../models/mentor_request.js";
import User from "../../models/user.js";
import { verifyToken as auth } from "../auth/index.js";
import { adminCheck } from "./middleware.js";
import {createNotification} from "../notifications.js";

const router = express.Router();

// @route   POST api/admin/mentor-requests
// @desc    Create a new mentor request
// @access  Private (Requires authentication)
router.post(
  "/mentor-requests",
  [
    auth,
    [
      check("requestText", "Request text is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { requestText } = req.body;

      const mentorRequest = new MentorRequest({
        user: req.user.id,
        requestText,
      });

      await mentorRequest.save();

      res.json({ msg: "Mentor request submitted successfully" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   GET api/admin/mentor-requests
// @desc    Get all mentor requests
// @access  Private (Requires authentication and admin role)
router.get("/mentor-requests", auth, adminCheck, async (req, res) => {
  try {
    const mentorRequests = await MentorRequest.find({ status: "pending" }).populate('user', 'name email');
    res.json(mentorRequests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   PUT api/admin/mentor-requests/:id/approve
// @desc    Approve a mentor request
// @access  Private (Requires authentication and admin role)
router.put("/mentor-requests/:id/approve", auth, adminCheck, async (req, res) => {
  try {
    const mentorRequest = await MentorRequest.findById(req.params.id).populate('user', 'name email');

    if (!mentorRequest) {
      return res.status(404).json({ msg: "Mentor request not found" });
    }

    // Update user role to mentor
    const user = await User.findById(mentorRequest.user._id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    user.mentor = true;
    await user.save();

    mentorRequest.status = "approved";
    await mentorRequest.save();

    // Create notification
    await createNotification(mentorRequest.user._id, 'mentor_request', `Your mentor request has been approved`, 'approved');

    res.json({ msg: "Mentor request approved successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   PUT api/admin/mentor-requests/:id/reject
// @desc    Reject a mentor request
// @access  Private (Requires authentication and admin role)
router.put("/mentor-requests/:id/reject", auth, adminCheck, async (req, res) => {
  try {
    const mentorRequest = await MentorRequest.findById(req.params.id);

    if (!mentorRequest) {
      return res.status(404).json({ msg: "Mentor request not found" });
    }

    mentorRequest.status = "rejected";
    await mentorRequest.save();

    // Create notification
    await createNotification(mentorRequest.user._id, 'mentor_request', `Your mentor request has been rejected`, 'rejected');

    res.json({ msg: "Mentor request rejected successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

export default router;
