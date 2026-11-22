import "dotenv/config";

const auth0Domain = process.env.AUTH0_M2M_DOMAIN;
const auth0LoginDomain = process.env.AUTH0_DOMAIN;

const clientId = process.env.AUTH0_M2M_CLIENT_ID;
const clientSecret = process.env.AUTH0_M2M_CLIENT_SECRET;

const connection = "Username-Password-Authentication";

if (!auth0Domain || !clientId || !clientSecret) {
  throw new Error("Auth0 Management API environment variables are missing");
}

// ========================================
// AUTH0 MANAGEMENT API
// ========================================

async function getManagementToken(): Promise<string> {
  const response = await fetch(`https://${auth0Domain}/oauth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      audience: `https://${auth0Domain}/api/v2/`,
      grant_type: "client_credentials",
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error_description ||
        data.message ||
        data.error ||
        "Failed to obtain Auth0 Management API token"
    );
  }

  return data.access_token as string;
}

// ========================================
// CREATE AUTH0 USER
// ========================================

interface CreateAuth0UserInput {
  email: string;
  password: string;
  full_name: string;
}

export async function createAuth0User(
  userData: CreateAuth0UserInput
): Promise<string> {
  const token = await getManagementToken();

  const response = await fetch(`https://${auth0Domain}/api/v2/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      connection,
      email: userData.email,
      password: userData.password,
      name: userData.full_name,
      email_verified: false,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create Auth0 user");
  }

  return data.user_id as string;
}

// ========================================
// DELETE AUTH0 USER
// ========================================

export async function deleteAuth0User(userId: string): Promise<void> {
  const token = await getManagementToken();

  const response = await fetch(
    `https://${auth0Domain}/api/v2/users/${encodeURIComponent(userId)}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete Auth0 user");
  }
}

// ========================================
// AUTH0 LOGIN
// ========================================

interface Auth0LoginInput {
  email: string;
  password: string;
}

export async function loginWithAuth0(credentials: Auth0LoginInput) {
  const loginClientId = process.env.AUTH0_CLIENT_ID;
  const audience = process.env.AUTH0_AUDIENCE;

  if (!loginClientId || !auth0LoginDomain || !audience) {
    throw new Error("Auth0 login environment variables are missing");
  }

  const response = await fetch(
    `https://${auth0LoginDomain}/oauth/token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        grant_type: "http://auth0.com/oauth/grant-type/password-realm",
        client_id: loginClientId,
        username: credentials.email,
        password: credentials.password,
        realm: connection,
        audience,
        scope: "openid profile email",
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error_description ||
        data.error ||
        "Authentication failed"
    );
  }

  return {
    access_token: data.access_token,
    id_token: data.id_token,
    token_type: data.token_type,
    expires_in: data.expires_in,
  };
}
