import { Router } from "express";
import { asyncHandler } from "../../../../middlewares/handlers/async-handler";
import { getOrganizationRoles } from "../../../../controllers/admin/organization/roles/get-organization-roles";
import { capabilitiesMap } from "../../../../utils/types/admin-capabilities";
import { requiresCapability } from "../../../../middlewares/authorize-admin";
import { updateOrganizationRole } from "../../../../controllers/admin/organization/roles/update-organization-roles";
import { createOrganizationRole } from "../../../../controllers/admin/organization/roles/create-organization-roles";
import { deleteOrganizationRole } from "../../../../controllers/admin/organization/roles/delete-organization-role";
import { getOrganizationRoleById } from "../../../../controllers/admin/organization/roles/get-role-by-id";

const roleRouter = Router();

roleRouter
  .get("/", asyncHandler(getOrganizationRoles))
  .post(
    "/",
    requiresCapability(capabilitiesMap.roles.manageRoles),
    asyncHandler(createOrganizationRole)
  )
  .put(
    "/",
    requiresCapability(capabilitiesMap.roles.manageRoles),
    asyncHandler(updateOrganizationRole)
  )
  .get("/:roleId", asyncHandler(getOrganizationRoleById))
  .delete(
    "/:roleId",
    requiresCapability(capabilitiesMap.roles.manageRoles),
    asyncHandler(deleteOrganizationRole)
  );

export { roleRouter };
