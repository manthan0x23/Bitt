import { z } from "zod";

export const adminRoles = {
  superAdmin: "super_admin",
  moderator: "moderator",
  watcher: "watcher",
  interviewer: "interviewer",
  problemSetter: "problem_setter",
  restrict: "restrict",
} as const;

export type AdminRole = (typeof adminRoles)[keyof typeof adminRoles];
export const zAdminRolesEnum = z.enum(
  Object.values(adminRoles) as [AdminRole, ...AdminRole[]]
);
