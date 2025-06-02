import express from "express";
import User from "../../models/user.js"; // Assuming skill swappers are users
import UserRating from '../../models/user_rating.js';
import SwapRequestInteraction from '../../models/swap_request_interaction.js';
import SwapRequest from '../../models/swap_request.js';
import { verifyToken as auth } from "../auth/index.js"; // Authentication middleware
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
    const swappers = await User.find({ email:{$ne:"admin@admin.com"} }).select('-password'); // Exclude password and filter out admins

    // Map the fetched users to the structure expected by the frontend
    const formattedSwappers = await Promise.all(swappers.map(async swapper => {
      // Fetch average rating for the swapper
      const ratingResult = await UserRating.aggregate([
        { $match: { ratedUser: swapper._id } },
        { $group: { _id: null, averageRating: { $avg: '$rating' } } }
      ]);

      const averageRating = ratingResult.length > 0 ? ratingResult[0].averageRating : 0;

      return {
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
        rating: averageRating, // Use fetched average rating
        deadline: 'N/A', // Deadline is not a specific field in User model, keeping placeholder as N/A
        imageUrl: swapper.profilePicture || 'https://picsum.photos/200/300', // Use profilePicture if available
        skills: (swapper.skills && swapper.skills.length > 0) ? swapper.skills : (swapper.categories ? swapper.categories.map(category => category.name) : []), // Use skills or category if available
      };
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
    const swapper = await User.findById(req.params.id).select('-password').populate('categories');

    if (!swapper) {
      return res.status(404).json({ msg: "Skill swapper not found" });
    }

    const ratingResult = await UserRating.aggregate([
      { $match: { ratedUser: swapper._id } },
      { $group: { _id: null, averageRating: { $avg: '$rating' } } }
    ]);

    const averageRating = ratingResult.length > 0 ? ratingResult[0].averageRating : 0;

    // Fetch the most recent swap request interaction for this swapper
    const latestInteraction = await SwapRequestInteraction.findOne({ user: swapper._id })
      .sort({ createdAt: -1 }) // Sort by most recent
      .populate({
        path: 'swapRequest',
        populate: {
          path: 'createdBy',
          select: 'name' // Only select the name of the creator
        }
      });

    let senderName = 'N/A';
    let serviceOffered = 'N/A';
    let serviceRequired = 'N/A';
    let deadline = 'N/A';
    let serviceDescriptionFromSwap = 'No description available';

    if (latestInteraction && latestInteraction.swapRequest) {
      senderName = latestInteraction.swapRequest.createdBy ? latestInteraction.swapRequest.createdBy.name : 'N/A';
      serviceOffered = latestInteraction.swapRequest.serviceTitle || 'N/A';
      serviceRequired = latestInteraction.swapRequest.serviceRequired || 'N/A';
      deadline = latestInteraction.swapRequest.deadline ? new Date(latestInteraction.swapRequest.deadline).toLocaleDateString() : 'N/A';
      serviceDescriptionFromSwap = latestInteraction.swapRequest.serviceDescription || 'No description available';
    }

    const formattedSwapperDetails = {
      id: swapper._id,
      name: swapper.name,
      fullName: swapper.name,
      email: swapper.email,
      phone: swapper.phone || 'N/A',
      gender: swapper.gender || 'N/A',
      country: swapper.country || 'N/A',
      location: [swapper.city || '', swapper.country || ''].filter(Boolean).join(', ') || 'N/A',
      imageUrl: swapper.profilePicture || 'https://picsum.photos/200/300',
      category: swapper.skills && swapper.skills.length > 0 ? swapper.skills.join(', ') : 'No skills listed',
      skills: (swapper.skills && swapper.skills.length > 0) ? swapper.skills : (swapper.categories ? swapper.categories.map(category => category.name) : []),
      serviceDescription: swapper.serviceDescription || serviceDescriptionFromSwap, // Prioritize user's own description, fallback to swap request
      yearsOfExperience: swapper.yearsOfExperience > 0 ? `${swapper.yearsOfExperience} Years` : 'N/A',
      senderName: senderName,
      serviceOffered: serviceOffered,
      serviceRequired: serviceRequired,
      deadline: deadline,
      rating: averageRating,
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

// @route   DELETE /api/admin/skill-swappers/:id
// @desc    Delete a skill swapper by ID
// @access  Private (Admin only)
router.delete("/:id", auth, adminCheck, async (req, res) => {
  try {
    const swapper = await User.findById(req.params.id);

    if (!swapper) {
      return res.status(404).json({ msg: "Skill swapper not found" });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ msg: "Skill swapper removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Skill swapper not found' });
    }
    res.status(500).send("Server Error");
  }
});

export default router;
