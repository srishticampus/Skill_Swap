import { Router } from "express";
import profileRoutes from "./profile.js";
import membersRoutes from "./members.js";
import organizationSwapsRoutes from "./swaps.js"; // Import organization swaps routes

const router = Router();

router.use(profileRoutes);
router.use(membersRoutes);
router.use(organizationSwapsRoutes); // Use organization swaps routes

export default router;