import { Router } from "express";

import {
  register,
  registerAdvisor,
  login,
  getMe,
} from "../controllers/auth.controller.js";

import { checkJwt } from "../config/auth0.js";

const router = Router();

// User registration
router.post("/register", register);
router.post("/register/advisor", registerAdvisor);

// User login
router.post("/login", login);

// Get authenticated user
router.get("/me", checkJwt, getMe);

export default router;

