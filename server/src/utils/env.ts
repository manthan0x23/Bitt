import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().min(1, "PORT is required"),
  CLIENT_URL: z.string().url("CLIENT_URL must be a valid URL"),
  GOOGLE_AUTH_CLIENT_ID: z.string().min(1, "GOOGLE_AUTH_CLIENT_ID is required"),
  GOOGLE_AUTH_CLIENT_SECRET: z
    .string()
    .min(1, "GOOGLE_AUTH_CLIENT_SECRET is required"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid URL"),
  NODE_ENV: z.string().optional().default("prod"),
  AWS_ACCESS_KEY: z.string().min(1, "AWS_ACCESS_KEY is required"),
  AWS_SECRET_KEY: z.string().min(1, "AWS_SECRET_KEY is required"),
  AWS_CLOUD_FRONT_DISTRIBUTION_URL: z
    .string()
    .url("AWS_CLOUD_FRONT_DISTRIBUTION_URL is required"),
  AWS_S3_BUCKET_NAME: z.string().min(1, "AWS_S3_BUCKET_NAME is required"),
  DEEP_INFRA_API_KEY: z.string().min(1, "DEEP_INFRA_API_KEY is required"),
  OPEN_ROUTER_API_KEY: z.string().min(1, "OPEN_ROUTER_API_KEY is required"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables:", parsedEnv.error.format());
  process.exit(1);
}

export const Env = parsedEnv.data;

export const GOOGLE_AUTH_SCOPE = ["openid", "email", "profile"].join(" ");
