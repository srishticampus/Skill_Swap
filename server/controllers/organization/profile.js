import { Router } from "express";
import Organization from "../../models/organization.js";
import User from "../../models/user.js"; // Import the User model
import organizationAuth from "../../middleware/organizationAuth.js";

const router = Router();

// Get organization profile
router.get("/profile", organizationAuth, async (req, res) => {
  try {
    // Organization ID is available in req.organization after organizationAuth middleware
    const organization = await Organization.findById(req.organization.id);

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    res.json(organization);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update organization profile
router.put("/profile", organizationAuth, async (req, res) => {
  try {
    const { name, phone, address, certificate, email, registerNumber, pincode } = req.body;
    const organizationId = req.organization.id; // Organization ID is in req.organization

    const organization = await Organization.findByIdAndUpdate(
      organizationId,
      { name, phone, address, certificate, email, registerNumber, pincode },
      { new: true, runValidators: true }
    );

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    res.json(organization);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete organization profile
router.delete("/profile", organizationAuth, async (req, res) => {
  try {
    const organizationId = req.organization.id; // Organization ID is in req.organization

    // Delete all users associated with this organization
    await User.deleteMany({ organizationId: organizationId });

    const organization = await Organization.findByIdAndDelete(organizationId);

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    res.json({ message: "Organization and its members deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
