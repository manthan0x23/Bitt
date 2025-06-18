import { Router } from "express";
import { asyncHandler } from "../../../middlewares/handlers/async-handler";
import { getTestcases } from "../../../controllers/admin/stages/contest/testcases/get-testcases";
import { createTestCase } from "../../../controllers/admin/stages/contest/testcases/create-testcases";
import { uploadHandler } from "../../../middlewares/handlers/uploads-handler";
import { requiresCapability } from "../../../middlewares/authorize-admin";
import { capabilitiesMap } from "../../../utils/types/admin-capabilities";

const testcaseRouter = Router();

testcaseRouter
  .get("/all/:stageId/problem/:problemIndex", asyncHandler(getTestcases))
  .post(
    "/create",
    requiresCapability(capabilitiesMap.contestProblem.create),
    uploadHandler().fields([
      { name: "inputFile", maxCount: 1 },
      { name: "outputFile", maxCount: 1 },
    ]),
    asyncHandler(createTestCase)
  );

export { testcaseRouter };
