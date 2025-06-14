import { Router } from "express";
import { asyncHandler } from "../../../../middlewares/handlers/async-handler";
import { getContest } from "../../../../controllers/admin/stages/contest/get-contest";
import { updateContest } from "../../../../controllers/admin/stages/contest/update-contest";
import { getContestProblems } from "../../../../controllers/admin/stages/contest/problems/get-problems";
import { createContestProblems } from "../../../../controllers/admin/stages/contest/problems/create-problems";
import { updateContestProblems } from "../../../../controllers/admin/stages/contest/problems/update-problems";

const contestRouter = Router();

contestRouter.get("/get/:stageId", asyncHandler(getContest));
contestRouter.put("/update", asyncHandler(updateContest));

// contest problems
contestRouter.get("/problems/:stageId", asyncHandler(getContestProblems));
contestRouter.post(
  "/problems/create/:stageId",
  asyncHandler(createContestProblems)
);
contestRouter.put("/problems/update", asyncHandler(updateContestProblems));

export { contestRouter };
