import { Router } from "express";
import { createOrganization } from "../../../controllers/admin/organization/create-organization";
import { joinOrganization } from "../../../controllers/admin/organization/join-organization";
import { asyncHandler } from "../../../middlewares/handlers/async-handler";
import { uploadHandler } from "../../../middlewares/handlers/uploads-handler";
import { updateOrganization } from "../../../controllers/admin/organization/update-organization";
import { inviteRouter } from "./invites";
import { getOrganizationById } from "../../../controllers/admin/organization/get-organization-by-id";
import { getOrganizationMembers } from "../../../controllers/admin/organization/get-org-members";
import { roleRouter } from "./roles";
import { requiresCapability } from "../../../middlewares/authorize-admin";
import {
  capabilities,
  capabilitiesMap,
} from "../../../utils/types/admin-capabilities";

const organizationRouter = Router();

organizationRouter
  .use("/invite", inviteRouter)
  .use("/roles", roleRouter)
  .get("/my", asyncHandler(getOrganizationById))
  .get("/members", asyncHandler(getOrganizationMembers))
  .post("/create", asyncHandler(createOrganization))
  .post("/join", asyncHandler(joinOrganization))
  .put(
    "/update",
    requiresCapability(capabilitiesMap.organization.update),
    uploadHandler().single("logo"),
    asyncHandler(updateOrganization)
  );

export { organizationRouter };
