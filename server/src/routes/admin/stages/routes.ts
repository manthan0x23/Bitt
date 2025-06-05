import { Router } from "express";
import { getStagesByJobId } from "../../../controllers/admin/stages/get-stages-by-job-id";
import { createStage } from "../../../controllers/admin/stages/create-stage";

const stageRouter = Router();

stageRouter.post("/create", createStage);
stageRouter.get("/all/:jobId", getStagesByJobId);

export { stageRouter };
