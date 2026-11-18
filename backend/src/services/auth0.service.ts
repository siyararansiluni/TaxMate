
import "dotenv/config";

const auth0Domain = process.env.AUTH0_M2M_DOMAIN;
const clientId = process.env.AUTH0_M2M_CLIENT_ID;
const clientSecret = process.env.AUTH0_M2M_CLIENT_SECRET;

const connection = "Username-Password-Authentication";

if (!auth0Domain || !clientId || !clientSecret) {
  throw new Error("Auth0 Management API environment variables are missing");
}

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
