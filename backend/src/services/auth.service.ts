
import { prisma } from "../config/database.js";
import {
  createAuth0User,
  deleteAuth0User,
} from "./auth0.service.js";
import type { RegisterInput } from "../validators/auth.validator.js";

export async function registerTaxpayer(input: RegisterInput) {
  const existingUser = await prisma.users.findFirst({
    where: {
      email: {
        equals: input.email,
        mode: "insensitive",
      },
    },
  });

  if (existingUser) {
    throw new Error("An account with this email already exists");
  }
    const existingProfile = await prisma.taxpayer_profiles.findFirst({
    where: {
      nic: input.nic,
    },
  });

  if (existingProfile) {
    throw new Error("An account with this NIC already exists");
  }

    const auth0UserId = await createAuth0User({
    email: input.email,
    password: input.password,
    full_name: input.full_name,
  });

    const taxpayerRole = await prisma.roles.findUnique({
    where: {
      role_name: "TAXPAYER",
    },
  });

  if (!taxpayerRole) {
    throw new Error("TAXPAYER role not found in database");
  }


    try {
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.users.create({
        data: {
          auth0_user_id: auth0UserId,
          email: input.email,
          account_status: "ACTIVE",
        },
      });

      await tx.user_roles.create({
        data: {
          user_id: user.user_id,
          role_id: taxpayerRole.role_id,
        },
      });

      const profile = await tx.taxpayer_profiles.create({
        data: {
          user_id: user.user_id,
          full_name: input.full_name,
          nic: input.nic,
        },
      });

      return {
        user_id: user.user_id,
        email: user.email,
        full_name: profile.full_name,
        role: "TAXPAYER",
      };
    });

    return result;
  } catch (error) {
    try {
      await deleteAuth0User(auth0UserId);
    } catch (cleanupError) {
      console.error("Failed to clean up Auth0 user:", cleanupError);
    }

    throw error;
  }}

export async function getAuthenticatedUser(auth0UserId: string) {
  const user = await prisma.users.findUnique({
    where: {
      auth0_user_id: auth0UserId,
    },
    select: {
      user_id: true,
      email: true,
      account_status: true,

      user_roles: {
        select: {
          roles: {
            select: {
              role_name: true,
            },
          },
        },
      },

      taxpayer_profiles: {
        select: {
          full_name: true,
        },
      },

      advisor_profiles: {
        select: {
          qualifications: true,
          experience_years: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error("User account not found");
  }

  if (user.account_status !== "ACTIVE") {
    throw new Error("Your account is not active");
  }

  return {
    user_id: user.user_id,
    email: user.email,
    roles: user.user_roles.map(
      (userRole) => userRole.roles.role_name
    ),
    taxpayer_profile: user.taxpayer_profiles,
    advisor_profile: user.advisor_profiles,
  };
}

