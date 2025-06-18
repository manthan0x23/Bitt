import { Router } from "express";
import { asyncHandler } from "../../../middlewares/handlers/async-handler";
import { createJob } from "../../../controllers/admin/jobs/create-job";
import { updateJob } from "../../../controllers/admin/jobs/update-job";
import { deleteJob } from "../../../controllers/admin/jobs/delete-job";
import { getJobById } from "../../../controllers/admin/jobs/get-job-by-id";
import { getOrganizationJobs } from "../../../controllers/admin/jobs/get-all-jobs";
import { requiresCapability } from "../../../middlewares/authorize-admin";
import { capabilitiesMap } from "../../../utils/types/admin-capabilities";

const jobRouter = Router();

jobRouter
  .post(
    "/create",
    requiresCapability(capabilitiesMap.job.create),
    asyncHandler(createJob)
  )
  .put(
    "/update",
    requiresCapability(capabilitiesMap.job.update),
    asyncHandler(updateJob)
  )
  .delete(
    "/:id",
    requiresCapability(capabilitiesMap.job.delete),
    asyncHandler(deleteJob)
  )
  .get("/get/:id", asyncHandler(getJobById))
  .get("/all", asyncHandler(getOrganizationJobs));

export { jobRouter };
