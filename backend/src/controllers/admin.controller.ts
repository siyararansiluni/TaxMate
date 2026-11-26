import type { Request, Response } from "express";
import { z } from "zod";

import {
  findAdminUserById,
  listAdminUsers,
} from "../services/admin.service.js";

const userIdSchema = z.string().uuid();

export async function getAdminUsers(
  _req: Request,
  res: Response
): Promise<void> {
  try {
    const users = await listAdminUsers();

    res.status(200).json({
      status: "success",
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error) {
    console.error("Get admin users error:", error);

    res.status(500).json({
      status: "error",
      message: "Failed to retrieve users",
    });
  }
}

export async function getAdminUserById(
  req: Request,
  res: Response
): Promise<void> {
  const validation = userIdSchema.safeParse(req.params.userId);

  if (!validation.success) {
    res.status(400).json({
      status: "error",
      message: "A valid user ID is required",
    });
    return;
  }

  try {
    const user = await findAdminUserById(validation.data);

    if (!user) {
      res.status(404).json({
        status: "error",
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error) {
    console.error("Get admin user error:", error);

    res.status(500).json({
      status: "error",
      message: "Failed to retrieve user",
    });
  }
}