import express from "express";
import users from "./users.js";
import mentorRequests from "./mentorRequests.js";
import category from "./category.js";
import stats from "./stats.js";
import organizations from "./organizations.js";


const router = express.Router();

router.use(users);
router.use(mentorRequests);
router.use('/categories', category);
router.use('/stats', stats);
router.use('/organizations', organizations);

export { router };
