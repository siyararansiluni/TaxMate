


import { Router } from "express";

import {
  register,
  login,
  getMe,
} from "../controllers/auth.controller.js";

import { checkJwt } from "../config/auth0.js";

const router = Router();

// User registration
router.post("/register", register);

// User login
router.post("/login", login);

// Get authenticated user
router.get("/me", checkJwt, getMe);

export default router;

