import type { Role } from "../data/mockUsers";

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

export interface Auth0TokenResponse {
  access_token: string;
  id_token: string;
  refresh_token?: string;
  token_type: string;
  expires_in: number;
}

interface Auth0ErrorResponse {
  error: string;
  error_description?: string;
}

function auth0ConfigError() {
  throw new Error(
    "Missing Auth0 configuration. Check VITE_AUTH0_DOMAIN, VITE_AUTH0_CLIENT_ID and VITE_AUTH0_AUDIENCE."
  );
}

export async function loginWithAuth0(email: string, password: string) {
  if (!domain || !clientId || !audience) auth0ConfigError();

  const response = await fetch(`https://${domain}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "http://auth0.com/oauth/grant-type/password-realm",
      client_id: clientId,
      username: email.trim(),
      password,
      realm: "Username-Password-Authentication",
      audience,
      scope: "openid profile email",
    }),
  });

  const data = (await response.json()) as Auth0TokenResponse & Auth0ErrorResponse;

  if (!response.ok) {
    if (data.error === "invalid_grant") {
      throw new Error("Invalid email or password.");
    }

    throw new Error(data.error_description || "Unable to sign in with Auth0.");
  }

  return data;
}

export async function registerWithAuth0(input: {
  email: string;
  password: string;
  name: string;
  role: Role;
  userMetadata: Record<string, unknown>;
}) {
  if (!domain || !clientId) auth0ConfigError();

  const response = await fetch(`https://${domain}/dbconnections/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: clientId,
      connection: "Username-Password-Authentication",
      email: input.email.trim(),
      password: input.password,
      name: input.name.trim(),
      user_metadata: {
        role: input.role,
        ...input.userMetadata,
      },
    }),
  });

  const data = (await response.json()) as
    | { _id: string; email: string; email_verified: boolean }
    | Auth0ErrorResponse;

  if (!response.ok) {
    const error = data as Auth0ErrorResponse;
    throw new Error(error.error_description || error.error || "Unable to create account.");
  }

  return data;
}

export async function getAuth0UserInfo(accessToken: string) {
  if (!domain) auth0ConfigError();

  const response = await fetch(`https://${domain}/userinfo`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const data = (await response.json()) as
    | Record<string, unknown>
    | Auth0ErrorResponse;

  if (!response.ok) {
    const error = data as Auth0ErrorResponse;
    throw new Error(error.error_description || error.error || "Unable to load Auth0 user information.");
  }

  return data as Record<string, unknown>;
}

export function decodeJwt<T>(token: string): T | null {
  try {
    const payload = token.split(".")[1];
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      "="
    );
    const json = decodeURIComponent(
      atob(padded)
        .split("")
        .map((character) => `%${character.charAt(0).charCodeAt(0).toString(16).padStart(2, "0")}`)
        .join("")
    );
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

export function logoutWithAuth0() {
  if (!domain || !clientId) {
    window.location.assign("/login");
    return;
  }

  const returnTo =
    import.meta.env.VITE_AUTH0_LOGOUT_URL ||
    `${window.location.origin}/login`;
  const logoutUrl = new URL(`https://${domain}/v2/logout`);
  logoutUrl.searchParams.set("client_id", clientId);
  logoutUrl.searchParams.set("returnTo", returnTo);

  window.location.assign(logoutUrl.toString());
}
