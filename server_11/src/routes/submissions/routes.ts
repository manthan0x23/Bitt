import { Router } from "express";
import { asyncHandler } from "../../middlewares/handlers/async-handler";
import { createSubmission } from "../../controllers/contests/submissions/create-submission";

const submissionRouter = Router();

submissionRouter.post("/submit", asyncHandler(createSubmission));

export { submissionRouter };
