import express from "express";
import Organization from "../../models/organization.js"; // Assuming Organization model path
import { adminCheck } from "./middleware.js"; // Import adminCheck middleware
import { auth } from "../auth/index.js"; // Assuming this path is correct

export const router = express.Router();

// @route   GET api/admin/organizations
// @desc    Get all organizations
// @access  Private (Admin only)
router.get("/", auth, adminCheck, async (req, res) => {
  try {
    // Find all organizations and exclude the password field
    const organizations = await Organization.find().select('-password');
    res.json(organizations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});


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
    organization.active = true;
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

// @route   PUT api/admin/organizations/activate/:id
// @desc    Activate an organization
// @access  Private (Admin only)
router.put("/activate/:id", auth, adminCheck, async (req, res) => {
    try {
        let organization = await Organization.findById(req.params.id);

        if (!organization) {
            return res.status(404).json({ msg: "Organization not found" });
        }

        // You might want to add checks here, e.g., only activate if status is approved or inactive
        // For now, we'll just set the status to 'active'
        organization.active = true;
        await organization.save();

        res.json({ msg: "Organization activated", organization });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Organization not found' });
        }
        res.status(500).send("Server Error");
    }
});

// @route   PUT api/admin/organizations/deactivate/:id
// @desc    Deactivate an organization
// @access  Private (Admin only)
router.put("/deactivate/:id", auth, adminCheck, async (req, res) => {
    try {
        let organization = await Organization.findById(req.params.id);

        if (!organization) {
            return res.status(404).json({ msg: "Organization not found" });
        }

        // Set status to 'inactive'
        organization.active = false;
        await organization.save();

        res.json({ msg: "Organization deactivated", organization });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Organization not found' });
        }
        res.status(500).send("Server Error");
    }
});

// @route   GET api/admin/organizations/:id
// @desc    Get organization by ID
// @access  Private (Admin only)
router.get("/:id", auth, adminCheck, async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id).select('-password');

    if (!organization) {
      return res.status(404).json({ msg: "Organization not found" });
    }

    res.json(organization);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Organization not found' });
    }
    res.status(500).send("Server Error");
  }
});

export default router;
