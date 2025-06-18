import { shortId } from "../../utils/integrations/short-id";
import { adminRoles } from "./admin-roles";
import { roleCapabilitiesMap } from "./role-capabilities";

const defaultInsertableRoles = [
  adminRoles.superAdmin,
  adminRoles.moderator,
  adminRoles.watcher,
  adminRoles.problemSetter,
  adminRoles.interviewer,
] as const;

const roleColorMap: Record<(typeof defaultInsertableRoles)[number], string> = {
  super_admin: "green",
  moderator: "blue",
  watcher: "orange",
  problem_setter: "pink",
  interviewer: "teal",
} as const;

export const insertDefaultRoles = async (organizationId: string) => {
  const inserts = defaultInsertableRoles.map((tag) => ({
    id: shortId(),
    tag,
    capabilities: roleCapabilitiesMap[tag],
    organizationId,
    color: roleColorMap[tag],
  }));

  return inserts;
};
