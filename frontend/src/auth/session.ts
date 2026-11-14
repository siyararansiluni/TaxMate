import type { Role } from "../data/mockUsers";

export interface Session {
  email: string;
  name: string;
  role: Role;
}

const KEY = "taxmate_user";

/** Where each role lands after login (and when sent away from a wrong page). */
export const homePaths: Record<Role, string> = {
  TAXPAYER: "/dashboard",
  ADVISOR: "/advisor/dashboard",
  ADMIN: "/admin/dashboard",
};

/** Reads the logged-in user from sessionStorage or localStorage. */
export function getSession(): Session | null {
  try {
    const raw = sessionStorage.getItem(KEY) ?? localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

/** Saves the user. "remember" keeps them logged in after the browser closes. */
export function saveSession(session: Session, remember: boolean) {
  clearSession();
  (remember ? localStorage : sessionStorage).setItem(
    KEY,
    JSON.stringify(session)
  );
}

/** Call this from every Logout button. */
export function clearSession() {
  sessionStorage.removeItem(KEY);
  localStorage.removeItem(KEY);
}