import { Router } from "express";
import { asyncHandler } from "../../../../middlewares/handlers/async-handler";
import { getQuiz } from "../../../../controllers/admin/stages/quiz/get-quiz";
import { updateQuiz } from "../../../../controllers/admin/stages/quiz/update-quiz";
import { generateQuizWithAi } from "../../../../controllers/admin/stages/quiz/generate-with-ai";

const quizRouter = Router();

quizRouter.get("/get/:stageId", asyncHandler(getQuiz));
quizRouter.post("/update", asyncHandler(updateQuiz));
quizRouter.put("/generate/:stageId", asyncHandler(generateQuizWithAi));

export { quizRouter };
