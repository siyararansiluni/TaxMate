import type { Role } from "../data/mockUsers";

export interface Session {
  email: string;
  name: string;
  role: Role;
}

const KEY = "taxmate_user";
const ACCESS_TOKEN_KEY = "taxmate_access_token";
const ID_TOKEN_KEY = "taxmate_id_token";
const ACCESS_TOKEN_EXPIRY_KEY = "taxmate_access_token_expiry";

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
  sessionStorage.removeItem(KEY);
  localStorage.removeItem(KEY);
  (remember ? localStorage : sessionStorage).setItem(
    KEY,
    JSON.stringify(session)
  );
}

/** Call this from every Logout button. */
export function clearSession() {
  sessionStorage.removeItem(KEY);
  localStorage.removeItem(KEY);
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(ID_TOKEN_KEY);
  localStorage.removeItem(ID_TOKEN_KEY);
  sessionStorage.removeItem(ACCESS_TOKEN_EXPIRY_KEY);
  localStorage.removeItem(ACCESS_TOKEN_EXPIRY_KEY);
}

export function saveAccessToken(accessToken: string, expiresIn?: number) {
  sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (expiresIn) {
    sessionStorage.setItem(
      ACCESS_TOKEN_EXPIRY_KEY,
      String(Date.now() + expiresIn * 1000)
    );
  }
}

export function getAccessToken(): string | null {
  return (
    sessionStorage.getItem(ACCESS_TOKEN_KEY) ??
    localStorage.getItem(ACCESS_TOKEN_KEY)
  );
}

export function getIdToken(): string | null {
  return (
    sessionStorage.getItem(ID_TOKEN_KEY) ??
    localStorage.getItem(ID_TOKEN_KEY)
  );
}