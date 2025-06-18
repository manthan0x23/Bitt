import { Router } from "express";
import { asyncHandler } from "../../../middlewares/handlers/async-handler";
import { createJob } from "../../../controllers/admin/jobs/create-job";
import { updateJob } from "../../../controllers/admin/jobs/update-job";
import { deleteJob } from "../../../controllers/admin/jobs/delete-job";
import { getJobById } from "../../../controllers/admin/jobs/get-job-by-id";
import { getOrganizationJobs } from "../../../controllers/admin/jobs/get-all-jobs";
import { allowedRoles } from "../../../middlewares/role-based-access";
import { adminRoles } from "../../../utils/types/admin-roles";

const jobRouter = Router();

jobRouter
  .post(
    "/create",
    allowedRoles([adminRoles.superAdmin, adminRoles.moderator]),
    asyncHandler(createJob)
  )
  .put(
    "/update",
    allowedRoles([adminRoles.superAdmin, adminRoles.moderator]),
    asyncHandler(updateJob)
  )
  .delete(
    "/:id",
    allowedRoles([adminRoles.superAdmin, adminRoles.moderator]),
    asyncHandler(deleteJob)
  )
  .get("/get/:id", asyncHandler(getJobById))
  .get("/all", asyncHandler(getOrganizationJobs));

export { jobRouter };
