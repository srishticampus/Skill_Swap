import express from "express";
import users from "./users.js";
import mentorRequests from "./mentorRequests.js";
import category from "./category.js";
import stats from "./stats.js";
import organizations from "./organizations.js";
import skillSwappers from "./skillSwappers.js"; // Import the new skillSwappers router
import adminComplaintRoutes from "./complaints.js"; // Import admin complaint routes

const router = express.Router();

router.use(users);
router.use(mentorRequests);
router.use('/categories', category);
router.use('/stats', stats);
router.use('/organizations', organizations);
router.use('/skill-swappers', skillSwappers); // Use the new skillSwappers router
router.use('/complaints', adminComplaintRoutes); // Use admin complaint routes

export { router };
