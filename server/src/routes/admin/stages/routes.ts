import { Router } from "express";
import { getStagesByJobId } from "../../../controllers/admin/stages/get-stages-by-job-id";
import { createStage } from "../../../controllers/admin/stages/create-stage";
import { asyncHandler } from "../../../middlewares/handlers/async-handler";
import { quizRouter } from "./quiz/route";

const stageRouter = Router();

stageRouter.use("/quiz", quizRouter);

stageRouter.post("/create", asyncHandler(createStage));
stageRouter.get("/all/:jobId", asyncHandler(getStagesByJobId));

export { stageRouter };
