import { Router } from "express";
import SwapRequest from "../../models/swap_request.js";
import User from "../../models/user.js";
import organizationAuth from "../../middleware/organizationAuth.js";

const router = Router();

// @route   GET /api/organization/swaps
// @desc    Get all swap requests created by members of the logged-in organization
// @access  Private (Organization)
router.get("/swaps", organizationAuth, async (req, res) => {
  try {
    const organizationId = req.organization.id;

    // Find all users belonging to the organization
    const members = await User.find({ organization: organizationId }).select('_id');
    const memberIds = members.map(member => member._id);

    // Find all swap requests created by these members
    const organizationSwaps = await SwapRequest.find({ createdBy: { $in: memberIds } })
      .populate('serviceCategory')
      .populate('createdBy')
      .exec();

    res.status(200).json(organizationSwaps);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

export default router;