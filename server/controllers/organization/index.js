import { Router } from "express";
import profileRoutes from "./profile.js";
import membersRoutes from "./members.js";
import organizationSwapsRoutes from "./swaps.js"; // Import organization swaps routes
import organizationComplaintsRoutes from "./complaints.js"; // Import organization complaints routes
import organizationReviewsRoutes from "./reviews.js";

const router = Router();

router.use(profileRoutes);
router.use(membersRoutes);
router.use(organizationSwapsRoutes); // Use organization swaps routes
router.use('/complaints', organizationComplaintsRoutes); // Use organization complaints routes
router.use(organizationReviewsRoutes);

export default router;