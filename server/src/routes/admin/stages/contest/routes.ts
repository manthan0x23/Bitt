import { Router } from "express";
import { asyncHandler } from "../../../../middlewares/handlers/async-handler";
import { getContest } from "../../../../controllers/admin/stages/contest/get-contest";
import { updateContest } from "../../../../controllers/admin/stages/contest/update-contest";

const contestRouter = Router();

contestRouter.get("/get/:stageId", asyncHandler(getContest));
contestRouter.put("/update", asyncHandler(updateContest));

export { contestRouter };
