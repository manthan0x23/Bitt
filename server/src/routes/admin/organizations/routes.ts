import { Router } from "express";
import { createOrganization } from "../../../controllers/admin/organization/create-organization";
import { joinOrganization } from "../../../controllers/admin/organization/join-organization";
import { asyncHandler } from "../../../middlewares/handlers/async-handler";

const organizationRouter = Router();

organizationRouter
  .post("/create", asyncHandler(createOrganization))
  .post("/join", asyncHandler(joinOrganization));

export { organizationRouter };
