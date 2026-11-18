

import type { Request, Response } from "express";
import {
  registerTaxpayer,
  getAuthenticatedUser,
} from "../services/auth.service.js";
import { registerSchema } from "../validators/auth.validator.js";

export async function register(req: Request, res: Response) {
  try {
    const validation = registerSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: validation.error.flatten().fieldErrors,
      });
    }

    const result = await registerTaxpayer(validation.data);

    return res.status(201).json({
      status: "success",
      message: "Taxpayer registered successfully",
      data: result,
    });
  } catch (error) {
    console.error("Registration error:", error);

    const message =
      error instanceof Error ? error.message : "Registration failed";

    if (
      message.includes("already exists") ||
      message.includes("already registered")
    ) {
      return res.status(409).json({
        status: "error",
        message,
      });
    }

    return res.status(500).json({
      status: "error",
      message: "Registration failed. Please try again.",
    });
  }
}

export async function getMe(req: Request, res: Response) {
  try {
    const auth0UserId = req.auth?.payload.sub;

    if (typeof auth0UserId !== "string") {
      return res.status(401).json({
        status: "error",
        message: "Invalid authentication token",
      });
    }

    const user = await getAuthenticatedUser(auth0UserId);

    return res.status(200).json({
      status: "success",
      message: "User details retrieved successfully",
      data: user,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";

    if (message === "User account not found") {
      return res.status(404).json({
        status: "error",
        message,
      });
    }

    if (message === "Your account is not active") {
      return res.status(403).json({
        status: "error",
        message,
      });
    }

    console.error("Get user error:", error);

    return res.status(500).json({
      status: "error",
      message: "Failed to retrieve user details",
    });
  }
}
