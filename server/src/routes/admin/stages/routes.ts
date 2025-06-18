import { Router } from "express";
import { getStagesByJobId } from "../../../controllers/admin/stages/get-stages-by-job-id";
import { createStage } from "../../../controllers/admin/stages/create-stage";
import { asyncHandler } from "../../../middlewares/handlers/async-handler";
import { quizRouter } from "./quiz/route";
import { contestRouter } from "./contest/routes";
import { allowedRoles } from "../../../middlewares/role-based-access";
import { adminRoles } from "../../../utils/types/admin-roles";

const stageRouter = Router();

stageRouter.use("/quiz", quizRouter).use("/contest", contestRouter);

stageRouter
  .get("/all/:jobId", asyncHandler(getStagesByJobId))
  .post(
    "/create",
    allowedRoles([adminRoles.superAdmin, adminRoles.moderator]),
    asyncHandler(createStage)
  );

export { stageRouter };
