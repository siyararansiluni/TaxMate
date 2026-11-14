export type Role = "TAXPAYER" | "ADVISOR" | "ADMIN";

export interface MockUser {
  email: string;
  password: string;
  role: Role;
  name: string;
  /** Route to open after login. Must exist in AppRoutes. */
  destination: string;
}

/**
 * Temporary "database" used until the real backend is ready.
 * When the backend is built, delete this file and call your API from Login.tsx.
 *
 * Advisor and admin currently open a "coming soon" page.
 * Replace it in AppRoutes when those dashboards are built.
 */
export const mockUsers: MockUser[] = [
  {
    email: "taxpayer@gmail.com",
    password: "taxpayer123",
    role: "TAXPAYER",
    name: "Taxpayer",
    destination: "/dashboard",
  },
  {
    email: "advisor@gmail.com",
    password: "advisor123",
    role: "ADVISOR",
    name: "Tax Advisor",
    destination: "/advisor/dashboard",
  },
  {
    email: "admin@gmail.com",
    password: "admin123",
    role: "ADMIN",
    name: "Administrator",
    destination: "/admin/dashboard",
  },
];

/** Returns the matching user, or undefined when email or password is wrong. */
export function authenticate(
  email: string,
  password: string
): MockUser | undefined {
  const cleanEmail = email.trim().toLowerCase();
  return mockUsers.find(
    (u) => u.email === cleanEmail && u.password === password
  );
}