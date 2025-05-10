import { Router } from "express";
import Organization from "../../models/organization.js"; // Assuming the model path relative to controllers
import organizationAuth from "../../middleware/organizationAuth.js"; // Using organization auth middleware

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

export default router;