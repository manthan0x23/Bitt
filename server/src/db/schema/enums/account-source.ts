import { pgEnum } from "drizzle-orm/pg-core";

export const accountSourceEnum = pgEnum("account_source", [
  "google",
  "credentials",
]);
