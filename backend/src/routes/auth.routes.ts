

import { Router } from "express";
import { register, getMe } from "../controllers/auth.controller.js";
import { checkJwt } from "../config/auth0.js";

const router = Router();

router.post("/register", register);

router.get("/me", checkJwt, getMe);

export default router;
