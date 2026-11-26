import { prisma } from "../config/database.js";

const adminUserSelect = {
  user_id: true,
  email: true,
  account_status: true,
  created_at: true,
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
      specialization: true,
      phone: true,
    },
  },
} as const;

export async function listAdminUsers() {
  return prisma.users.findMany({
    select: adminUserSelect,
    orderBy: {
      created_at: "desc",
    },
  });
}

export async function findAdminUserById(userId: string) {
  return prisma.users.findUnique({
    where: {
      user_id: userId,
    },
    select: adminUserSelect,
  });
}