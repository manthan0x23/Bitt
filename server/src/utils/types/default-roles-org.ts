import z from "zod/v4";
import { shortId } from "../../utils/integrations/short-id";
import { adminRoles } from "./admin-roles";
import { roleCapabilitiesMap } from "./role-capabilities";
import { roles } from "../../db/schema";

const defaultInsertableRoles = [
  adminRoles.superAdmin,
  adminRoles.moderator,
  adminRoles.watcher,
  adminRoles.problemSetter,
  adminRoles.interviewer,
] as const;

export const colorSchemeEnum = z.enum([
  "gray", // default / neutral
  "blue", // info / primary
  "green", // success
  "red", // danger / error
  "pink", // playful / accent
  "orange", // warning
  "yellow", // caution
  "purple", // creativity / secondary
  "teal", // alternative success
  "indigo", // highlight
]);

export type ColorSchemes = z.infer<typeof colorSchemeEnum>;

const roleColorMap: Record<
  (typeof defaultInsertableRoles)[number],
  ColorSchemes
> = {
  super_admin: "green",
  moderator: "blue",
  watcher: "orange",
  problem_setter: "pink",
  interviewer: "teal",
} as const;

export const insertDefaultRoles = async (organizationId: string) => {
  const inserts: (typeof roles.$inferInsert)[] = defaultInsertableRoles.map(
    (tag) => ({
      id: shortId(),
      tag,
      capabilities: roleCapabilitiesMap[tag],
      organizationId,
      colorScheme: roleColorMap[tag],
      isTemplate: true,
    })
  );

  return inserts;
};
