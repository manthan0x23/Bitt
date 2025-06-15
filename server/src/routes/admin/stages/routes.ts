import { Router } from "express";
import { getStagesByJobId } from "../../../controllers/admin/stages/get-stages-by-job-id";
import { createStage } from "../../../controllers/admin/stages/create-stage";
import { asyncHandler } from "../../../middlewares/handlers/async-handler";
import { quizRouter } from "./quiz/route";
import { contestRouter } from "./contest/routes";

const stageRouter = Router();

stageRouter.use("/quiz", quizRouter).use("/contest", contestRouter);

stageRouter
  .get("/all/:jobId", asyncHandler(getStagesByJobId))
  .post("/create", asyncHandler(createStage));

export { stageRouter };
