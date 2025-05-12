import express from "express";
import Organization from "../../models/organization.js"; // Assuming Organization model path
import { adminCheck } from "./middleware.js"; // Import adminCheck middleware
import { auth } from "../auth/index.js"; // Assuming this path is correct

export const router = express.Router();

// TODO: Implement admin authentication middleware and apply it to these routes
// import adminAuth from \'../../middleware/adminAuth\';

// @route   GET api/admin/organizations/pending
// @desc    Get all pending organization requests
// @access  Private (Admin only)
router.get("/pending",auth, adminCheck, async (req, res) => {
  try {
    const pendingOrganizations = await Organization.find({ status: 'pending' }).select('-password'); // Exclude password
    res.json(pendingOrganizations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT api/admin/organizations/approve/:id
// @desc    Approve an organization request
// @access  Private (Admin only)
router.put("/approve/:id",auth,  adminCheck, async (req, res) => {
  try {
    let organization = await Organization.findById(req.params.id);

    if (!organization) {
      return res.status(404).json({ msg: "Organization not found" });
    }

    if (organization.status !== 'pending') {
        return res.status(400).json({ msg: "Organization is not pending approval" });
    }

    organization.status = 'approved';
    await organization.save();

    // TODO: Optionally send a notification email to the organization

    res.json({ msg: "Organization approved", organization });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT api/admin/organizations/reject/:id
// @desc    Reject an organization request
// @access  Private (Admin only)
router.put("/reject/:id",auth,  adminCheck, async (req, res) => {
  try {
    let organization = await Organization.findById(req.params.id);

    if (!organization) {
      return res.status(404).json({ msg: "Organization not found" });
    }

     if (organization.status !== 'pending') {
        return res.status(400).json({ msg: "Organization is not pending approval" });
    }

    organization.status = 'rejected';
    await organization.save();

    // TODO: Optionally send a notification email to the organization explaining rejection

    res.json({ msg: "Organization rejected", organization });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

export default router;
