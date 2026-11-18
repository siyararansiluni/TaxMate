
import { auth } from "express-oauth2-jwt-bearer";

const domain = process.env.AUTH0_DOMAIN;
const audience = process.env.AUTH0_AUDIENCE;

if (!domain || !audience) {
  throw new Error("Auth0 environment variables are missing");
}

export const checkJwt = auth({
  issuerBaseURL: `https://${domain}/`,
  audience,
});
