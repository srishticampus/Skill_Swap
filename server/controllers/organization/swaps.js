import { Router } from "express";
import SwapRequest from "../../models/swap_request.js";
import User from "../../models/user.js";
import SwapRequestInteraction from "../../models/swap_request_interaction.js"; // Import SwapRequestInteraction
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
      .select('requestStatus serviceTitle serviceDescription deadline') // Explicitly select requestStatus and other necessary fields
      .lean() // Use .lean() for better performance when populating manually
      .exec();

    // For each swap request, find the associated accepted/in-progress interaction to get the requestedTo user
    const populatedSwaps = await Promise.all(organizationSwaps.map(async (swap) => {
      const interaction = await SwapRequestInteraction.findOne({
        swapRequest: swap._id,
        status: { $in: ['accepted', 'in progress'] } // Assuming 'accepted' or 'in progress' means a partner is assigned
      }).populate('user').lean().exec();

      return {
        ...swap,
        requestedTo: interaction ? interaction.user : null, // Attach the requestedTo user
        status: swap.requestStatus // Map requestStatus to status for client-side compatibility
      };
    }));

    res.status(200).json(populatedSwaps);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

export default router;
