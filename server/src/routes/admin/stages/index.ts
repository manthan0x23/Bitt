import { Router } from "express";
import { getStagesByJobId } from "../../../controllers/admin/stages/get-stages-by-job-id";
import { createStage } from "../../../controllers/admin/stages/create-stage";
import { asyncHandler } from "../../../middlewares/handlers/async-handler";
import { requiresCapability } from "../../../middlewares/authorize-admin";
import { capabilitiesMap } from "../../../utils/types/admin-capabilities";
import { quizRouter } from "./quiz";
import { contestRouter } from "./contest";

const stageRouter = Router();

stageRouter.use("/quiz", quizRouter).use("/contest", contestRouter);

stageRouter
  .get("/all/:jobId", asyncHandler(getStagesByJobId))
  .post(
    "/create",
    requiresCapability(capabilitiesMap.stage.create),
    asyncHandler(createStage)
  );

export { stageRouter };
