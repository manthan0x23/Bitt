import { Router } from "express";
import { asyncHandler } from "../../../../middlewares/handlers/async-handler";
import { getContest } from "../../../../controllers/admin/stages/contest/get-contest";
import { updateContest } from "../../../../controllers/admin/stages/contest/update-contest";
import { getContestProblems } from "../../../../controllers/admin/stages/contest/problems/get-problems";
import { createContestProblems } from "../../../../controllers/admin/stages/contest/problems/create-problems";
import { updateContestProblems } from "../../../../controllers/admin/stages/contest/problems/update-problems";
import { getContestProblemsById } from "../../../../controllers/admin/stages/contest/problems/get-problem-by-id";
import { capabilitiesMap } from "../../../../utils/types/admin-capabilities";
import { requiresCapability } from "../../../../middlewares/authorize-admin";

const contestRouter = Router();

// Contest Stage
contestRouter.get("/get/:stageId", asyncHandler(getContest));
contestRouter.put(
  "/update",
  requiresCapability(capabilitiesMap.contest.update),
  asyncHandler(updateContest)
);

// Contest Problems
contestRouter.get("/problems/:stageId", asyncHandler(getContestProblems));

contestRouter.get(
  "/problems/:stageId/get/:problemIndex",
  asyncHandler(getContestProblemsById)
);

contestRouter.post(
  "/problems/create/:stageId",
  requiresCapability(capabilitiesMap.contestProblem.create),
  asyncHandler(createContestProblems)
);

contestRouter.put(
  "/problems/update",
  requiresCapability(capabilitiesMap.contestProblem.update),
  asyncHandler(updateContestProblems)
);

export { contestRouter };
