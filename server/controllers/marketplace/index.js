import express from "express";
import User from "../../models/user.js";
import SwapRequest from "../../models/swap_request.js";

export const router = express.Router();

router.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.get("/pick-exchanges", async (req, res) => {
  try {
    const { excludeUserId } = req.query;
    const query = {};
    if (excludeUserId) {
      query.createdBy = { $ne: excludeUserId };
    }

    // Fetch swap requests and populate the 'createdBy' field to get user details
    const exchanges = await SwapRequest.find(query)
      .populate('createdBy', 'name skills city yearsOfExperience profilePicture') // Select specific user fields
      .limit(6);
    res.json(exchanges);
  } catch (error) {
    console.error("Error fetching pick exchanges:", error);
    res.status(500).json({ error: "Failed to fetch pick exchanges" });
  }
});

router.get("/related-exchanges", async (req, res) => {
  try {
    const { excludeUserId } = req.query;
    const query = {};
    if (excludeUserId) {
      query.createdBy = { $ne: excludeUserId };
    }

    // Fetch swap requests and populate the 'createdBy' field to get user details
    // In a real scenario, this would involve filtering based on the authenticated user's skills.
    const exchanges = await SwapRequest.find(query)
      .populate('createdBy', 'name skills city yearsOfExperience profilePicture') // Select specific user fields
      .limit(6);
    res.json(exchanges);
  } catch (error) {
    console.error("Error fetching related exchanges:", error);
    res.status(500).json({ error: "Failed to fetch related exchanges" });
  }
});
