import { Router } from "express";
import profileRoutes from "./profile.js";
import membersRoutes from "./members.js";

const router = Router();

router.use(profileRoutes);
router.use(membersRoutes);

export default router;