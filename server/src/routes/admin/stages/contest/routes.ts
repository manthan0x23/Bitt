import { Router } from "express";
import { asyncHandler } from "../../../../middlewares/handlers/async-handler";
import { getContest } from "../../../../controllers/admin/stages/contest/get-contest";
import { updateContest } from "../../../../controllers/admin/stages/contest/update-contest";
import { getContestProblems } from "../../../../controllers/admin/stages/contest/problems/get-problems";
import { createContestProblems } from "../../../../controllers/admin/stages/contest/problems/create-problems";
import { updateContestProblems } from "../../../../controllers/admin/stages/contest/problems/update-problems";
import { getContestProblemsById } from "../../../../controllers/admin/stages/contest/problems/get-problem-by-id";

const contestRouter = Router();

contestRouter
  .get("/get/:stageId", asyncHandler(getContest))
  .put("/update", asyncHandler(updateContest));

// contest problems
contestRouter
  .get("/problems/:stageId", asyncHandler(getContestProblems))
  .get("/problems/:stageId/get/:problemIndex", asyncHandler(getContestProblemsById))
  .post("/problems/create/:stageId", asyncHandler(createContestProblems))
  .put("/problems/update", asyncHandler(updateContestProblems));

export { contestRouter };
