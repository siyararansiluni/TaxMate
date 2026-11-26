import type { NextFunction, Request, Response } from "express";

import { prisma } from "../config/database.js";

export async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const auth0UserId = req.auth?.payload.sub;

  if (typeof auth0UserId !== "string") {
    res.status(401).json({
      status: "error",
      message: "Invalid authentication token",
    });
    return;
  }

  try {
    const user = await prisma.users.findUnique({
      where: { auth0_user_id: auth0UserId },
      select: {
        user_roles: {
          select: {
            roles: {
              select: {
                role_name: true,
              },
            },
          },
        },
      },
    });

    const isAdmin = user?.user_roles.some(
      ({ roles }) => roles.role_name === "ADMIN"
    );

    if (!isAdmin) {
      res.status(403).json({
        status: "error",
        message: "Admin access required",
      });
      return;
    }

    next();
  } catch (error) {
    console.error("Admin authorization error:", error);

    res.status(500).json({
      status: "error",
      message: "Unable to verify admin access",
    });
  }
}