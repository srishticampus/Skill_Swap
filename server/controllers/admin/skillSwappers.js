import express from "express";
import User from "../../models/user.js"; // Assuming skill swappers are users
import { auth } from "../auth/index.js"; // Authentication middleware
import { adminCheck } from "./middleware.js"; // Admin check middleware

const router = express.Router();

// @route   GET /api/admin/skill-swappers
// @desc    Get all skill swappers (assuming users with mentor: true)
// @access  Private (Admin only)
router.get("/", auth, adminCheck, async (req, res) => {
  try {
    // Fetch users who are marked as mentors.
    // Fetch users who are marked as mentors and are not administrators.
    // Adjust the query if 'skill swapper' is represented differently in your User model
    const swappers = await User.find({ mentor: true,email:{$ne:"admin@admin.com"} }).select('-password'); // Exclude password and filter out admins

    // Map the fetched users to the structure expected by the frontend
    const formattedSwappers = swappers.map(swapper => ({
      id: swapper._id,
      name: swapper.name,
      // Using skills array from User model for title
      title: swapper.skills && swapper.skills.length > 0 ? swapper.skills.join(', ') : 'No skills listed',
      // Combine city and country for location
      location: [swapper.city || '', swapper.country || ''].filter(Boolean).join(', ') || 'N/A',
      // Combine yearsOfExperience and experienceLevel for experience
      experience: [
        swapper.yearsOfExperience > 0 ? `${swapper.yearsOfExperience} years` : '',
        swapper.experienceLevel || ''
      ].filter(Boolean).join(' ').trim() || 'N/A',
      rating: 4, // Rating is not available in User model, keeping placeholder
      deadline: 'Deadline data (placeholder)', // Deadline is not a specific field in User model, keeping placeholder
      imageUrl: swapper.profilePicture || 'https://picsum.photos/200/300', // Use profilePicture if available
      skills: swapper.skills || [],
    }));

    res.json(formattedSwappers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/admin/skill-swappers/:id
// @desc    Get details of a specific skill swapper by ID
// @access  Private (Admin only)
router.get("/:id", auth, adminCheck, async (req, res) => {
  try {
    const swapper = await User.findById(req.params.id).select('-password'); // Fetch user by ID and exclude password

    if (!swapper || !swapper.mentor || swapper.isAdmin) {
      // Return 404 if user not found, not a mentor, or is an admin
      return res.status(404).json({ msg: "Skill swapper not found" });
    }

    // Map the fetched user data to the structure expected by the frontend details page
    const formattedSwapperDetails = {
      id: swapper._id,
      name: swapper.name, // Using name for both name and fullName for now
      fullName: swapper.name,
      email: swapper.email,
      phone: swapper.phone || 'N/A',
      gender: swapper.gender || 'N/A',
      country: swapper.country || 'N/A',
      location: [swapper.city || '', swapper.country || ''].filter(Boolean).join(', ') || 'N/A', // Combine city and country
      imageUrl: swapper.profilePicture || 'https://picsum.photos/200/300', // Use profilePicture if available
      category: swapper.skills && swapper.skills.length > 0 ? swapper.skills.join(', ') : 'No skills listed', // Using skills for category
      skills: swapper.skills || [],
      serviceDescription: swapper.serviceDescription || 'No description available',
      yearsOfExperience: swapper.yearsOfExperience > 0 ? `${swapper.yearsOfExperience} Years` : 'N/A',
      // Placeholder data for fields not directly available in User model
      senderName: 'Sender Name (placeholder)', // This likely comes from a swap request
      serviceOffered: 'Service Offered (placeholder)', // This likely comes from a swap request or user's detailed profile
      serviceRequired: 'Service Required (placeholder)', // This likely comes from a swap request
      deadline: 'Deadline data (placeholder)', // This likely comes from a swap request
      rating: 4, // Rating is not available in User model, keeping placeholder
    };


    res.json(formattedSwapperDetails);
  } catch (err) {
    console.error(err.message);
    // Handle invalid ObjectId
    if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Skill swapper not found' });
    }
    res.status(500).send("Server Error");
  }
});


export default router;
