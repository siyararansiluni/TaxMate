import { Router } from "express";

import {
  getAdminUserById,
  getAdminUsers,
} from "../controllers/admin.controller.js";
import { checkJwt } from "../config/auth0.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = Router();

router.use(checkJwt, requireAdmin);

router.get("/users", getAdminUsers);
router.get("/users/:userId", getAdminUserById);

export default router;