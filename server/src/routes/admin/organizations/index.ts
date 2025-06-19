import { Router } from "express";
import { createOrganization } from "../../../controllers/admin/organization/create-organization";
import { joinOrganization } from "../../../controllers/admin/organization/join-organization";
import { asyncHandler } from "../../../middlewares/handlers/async-handler";
import { uploadHandler } from "../../../middlewares/handlers/uploads-handler";
import { updateOrganization } from "../../../controllers/admin/organization/update-organization";
import { inviteRouter } from "./invites";
import { getOrganizationById } from "../../../controllers/admin/organization/get-organization-by-id";
import { getOrganizationMembers } from "../../../controllers/admin/organization/get-org-members";

const organizationRouter = Router();

organizationRouter
  .use("/invite", inviteRouter)
  .get("/my", asyncHandler(getOrganizationById))
  .get("/members", asyncHandler(getOrganizationMembers))
  .post("/create", asyncHandler(createOrganization))
  .post("/join", asyncHandler(joinOrganization))
  .put(
    "/update",
    uploadHandler().single("logo"),
    asyncHandler(updateOrganization)
  );

export { organizationRouter };
