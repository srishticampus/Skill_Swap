import express from "express";
import users from "./users.js";
import mentorRequests from "./mentorRequests.js";
import category from "./category.js";

const router = express.Router();

router.use(users);
router.use(mentorRequests);
router.use('/categories', category);

export { router };