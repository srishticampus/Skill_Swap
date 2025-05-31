import express from "express";
import MentorRequest from "../models/mentor_request.js";
import Notification from "../models/notification.js";
import { verifyToken as auth } from "./auth/index.js";

const router = express.Router();

// @route   GET api/notifications
// @desc    Get all notifications for a user
// @access  Private (Requires authentication)
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch notifications from the database
    const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   POST api/notifications
// @desc    Create a new notification
// @access  Private (Requires authentication)
export const createNotification = async (userId, type, message, status) => {
  try {
    const notification = new Notification({
      user: userId,
      type: type,
      message: message,
      status: status
    });

    await notification.save();
  } catch (err) {
    console.error(err.message);
  }
};

// @route   PUT api/notifications/:id/read
// @desc    Mark a notification as read
// @access  Private (Requires authentication)
router.put("/:id/read", auth, async (req, res) => {
  try {
    const notificationId = req.params.id;

    // Find the notification by ID
    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res.status(404).json({ msg: "Notification not found" });
    }

    // Mark the notification as read
    notification.read = true;
    await notification.save();

    res.json({ msg: "Notification marked as read" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

export default router;
