import { Router } from "express";
import profileRoutes from "./profile.js";
import membersRoutes from "./members.js";
import organizationSwapsRoutes from "./swaps.js"; // Import organization swaps routes
import organizationComplaintsRoutes from "./complaints.js"; // Import organization complaints routes
import organizationReviewsRoutes from "./reviews.js";
import organizationStatsRoutes from "./stats.js"; // Import organization stats routes
import organizationCategoryRoutes from "./category.js"; // Import organization category routes
import { createWorkshop, getOrganizationWorkshops, updateWorkshop, deleteWorkshop } from "./workshop.js";

const router = Router();

router.use(profileRoutes);
router.use(membersRoutes);
router.use(organizationSwapsRoutes); // Use organization swaps routes
router.use('/complaints', organizationComplaintsRoutes); // Use organization complaints routes
router.use(organizationReviewsRoutes);
router.use('/stats', organizationStatsRoutes); // Use organization stats routes
router.use('/categories', organizationCategoryRoutes); // Use organization category routes

// Workshop routes
router.post('/workshops', createWorkshop);
router.get('/workshops/my', getOrganizationWorkshops);
router.put('/workshops/:id', updateWorkshop);
router.delete('/workshops/:id', deleteWorkshop);

export default router;
