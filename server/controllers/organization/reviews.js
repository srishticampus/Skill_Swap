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
    const reviews = await UserRating.find({ reviewedUser: { $in: memberIds } })
      .populate('reviewer', 'firstName lastName') // Populate reviewer details
      .populate('reviewedUser', 'firstName lastName'); // Populate reviewed user details

    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch organization member reviews' });
  }
});

export default router;