import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT;
export const CLIENT_URL = process.env.CLIENT_URL;
export const GOOGLE_AUTH_CLIENT_ID = process.env.GOOGLE_AUTH_CLIENT_ID || "";
export const GOOGLE_AUTH_CLIENT_SECRET =
  process.env.GOOGLE_AUTH_CLIENT_SECRET || "";
export const JWT_SECRET = process.env.JWT_SECRET;

export const GOOGLE_AUTH_SCOPE = ["openid", "email", "profile"].join(" ");

if (!GOOGLE_AUTH_CLIENT_ID || !GOOGLE_AUTH_CLIENT_SECRET) {
  throw new Error("Missing required Google OAuth environment variables");
}

if (!PORT) {
  throw new Error("Missing required server run environment variables");
}
if (!JWT_SECRET) {
  throw new Error("Missing required secret environment variables");
}
