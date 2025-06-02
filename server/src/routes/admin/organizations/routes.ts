import { Router } from "express";
import { createOrganization } from "../../../controllers/admin/organization/create-organization";
import { joinOrganization } from "../../../controllers/admin/organization/join-organization";
import { asyncHandler } from "../../../middlewares/handlers/async-handler";
import { uploadHandler } from "../../../middlewares/handlers/uploads-handler";
import { updateOrganization } from "../../../controllers/admin/organization/update-organization";
import { inviteRouter } from "./invites/routes";
import { getOrganizationById } from "../../../controllers/admin/organization/get-organization-by-id";

const organizationRouter = Router();

organizationRouter
  .use("/invite", inviteRouter)
  .post("/create", asyncHandler(createOrganization))
  .post("/join", asyncHandler(joinOrganization))
  .put(
    "/update",
    uploadHandler.single("org_logo"),
    asyncHandler(updateOrganization)
  )
  .get("/:orgId", asyncHandler(getOrganizationById));

export { organizationRouter };
