import { Router } from "express";
import { asyncHandler } from "../../../middlewares/handlers/async-handler";
import { getTestcases } from "../../../controllers/admin/stages/contest/testcases/get-testcases";
import { createTestCase } from "../../../controllers/admin/stages/contest/testcases/create-testcases";
import multer from "multer";

const testcaseRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 3 * 1024 * 1024,
  },
});

testcaseRouter
  .get("/all/:stageId/problem/:problemIndex", asyncHandler(getTestcases))
  .post(
    "/create",
    upload.fields([
      { name: "inputFile", maxCount: 1 },
      { name: "outputFile", maxCount: 1 },
    ]),
    asyncHandler(createTestCase)
  );

export { testcaseRouter };
