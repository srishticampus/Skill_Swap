import express from 'express';
const router = express.Router();
import Organization from '../../models/organization.js';
import User from '../../models/user.js';
import UserRating from '../../models/user_rating.js';

router.get('/:organizationId/reviews', async (req, res) => {
  try {
    const organizationId = req.params.organizationId;

    // Find the organization
    const organization = await Organization.findById(organizationId);
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    // Find members of the organization
    const members = await User.find({ organization: organizationId });

    // Extract member IDs
    const memberIds = members.map(member => member._id);

    // Find reviews for the members
    const reviews = await UserRating.find({ ratedUser: { $in: memberIds } })
      .populate('rater', 'name profilePicture skills') // Populate rater details
      .populate('ratedUser', 'name'); // Populate rated user details

    // Transform reviews to match client expectations
    const transformedReviews = reviews.map(review => ({
      id: review._id,
      reviewerName: review.rater.name,
      reviewerAvatarUrl: review.rater.profilePicture, // Keep as relative path
      reviewerSkills: review.rater.skills ? review.rater.skills.join(', ') : '', // Join skills array into a string, handle null/undefined skills
      comment: review.reviewText,
      rating: review.rating,
      ratedUserName: review.ratedUser.name, // Add the name of the user being rated
      // swapTitle is explicitly not needed as per user's clarification
    }));

    res.status(200).json(transformedReviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch organization member reviews' });
  }
});

export default router;
