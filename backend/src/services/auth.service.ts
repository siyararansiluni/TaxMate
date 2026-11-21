
import { prisma } from "../config/database.js";

import {
  createAuth0User,
  deleteAuth0User,
  loginWithAuth0,
} from "./auth0.service.js";

import type {
  RegisterInput,
  LoginInput,
} from "../validators/auth.validator.js";

import { createRemoteJWKSet, jwtVerify } from "jose";

// Auth0 configuration for JWT verification
const auth0Domain = process.env.AUTH0_DOMAIN;
const auth0Audience = process.env.AUTH0_AUDIENCE;

if (!auth0Domain || !auth0Audience) {
  throw new Error("Auth0 JWT verification environment variables are missing");
}

// Auth0 public signing keys
const JWKS = createRemoteJWKSet(
  new URL(`https://${auth0Domain}/.well-known/jwks.json`)
);

// ========================================
// REGISTER TAXPAYER
// ========================================

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

  // 1. Check TAXPAYER role FIRST
const taxpayerRole = await prisma.roles.findUnique({
  where: {
    role_name: "TAXPAYER",
  },
});

if (!taxpayerRole) {
  throw new Error("TAXPAYER role not found in database");
}

// 2. Create Auth0 account SECOND
const auth0UserId = await createAuth0User({
  email: input.email,
  password: input.password,
  full_name: input.full_name,
});

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
  }
}

// ========================================
// GET AUTHENTICATED USER
// ========================================

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

// ========================================
// LOGIN USER
// ========================================

export async function loginUser(input: LoginInput) {
  // Step 1: Authenticate credentials through Auth0
  const auth0Response = await loginWithAuth0({
    email: input.email,
    password: input.password,
  });

  // Step 2: Verify the access token
  const { payload } = await jwtVerify(
    auth0Response.access_token,
    JWKS,
    {
      issuer: `https://${auth0Domain}/`,
      audience: auth0Audience,
    }
  );

  // Step 3: Extract the verified Auth0 user ID
  const auth0UserId = payload.sub;

  if (!auth0UserId) {
    throw new Error("Auth0 token does not contain a user ID");
  }

  // Step 4: Find the user in our TaxMate database
  const user = await getAuthenticatedUser(auth0UserId);

  // Step 5: Return authenticated user information and token
  return {
    access_token: auth0Response.access_token,
    token_type: auth0Response.token_type,
    expires_in: auth0Response.expires_in,
    user,
  };
}
