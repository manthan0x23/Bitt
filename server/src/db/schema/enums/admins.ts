import { pgEnum } from "drizzle-orm/pg-core";

export const adminRoleEnum = pgEnum("admin_role_enum", [
  "super_admin",
  "moderator",
  "watcher",
  "interviewer",
  "problem_setter",
  "restrict"
]);
