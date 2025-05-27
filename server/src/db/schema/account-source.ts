import { pgEnum } from "drizzle-orm/pg-core";

export const accountSource = pgEnum("account_source", [
  "google",
  "credentials",
]);
