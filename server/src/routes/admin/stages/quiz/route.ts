import { Router } from "express";
import { asyncHandler } from "../../../../middlewares/handlers/async-handler";
import { getQuiz } from "../../../../controllers/admin/stages/quiz/get-quiz";
import { updateQuiz } from "../../../../controllers/admin/stages/quiz/update-quiz";
import { generateQuizWithAi } from "../../../../controllers/admin/stages/quiz/generate-with-ai";
import { getQuizProblems } from "../../../../controllers/admin/stages/quiz/get-quiz-problems";
import { getQuizProblemById } from "../../../../controllers/admin/stages/quiz/get-problem";
import { updateQuizProblem } from "../../../../controllers/admin/stages/quiz/update-problem";
import { createQuizProblem } from "../../../../controllers/admin/stages/quiz/create-quiz-problem";

const quizRouter = Router();

quizRouter.get("/get/:stageId", asyncHandler(getQuiz));
quizRouter.post("/update", asyncHandler(updateQuiz));
quizRouter.put("/generate/:stageId", asyncHandler(generateQuizWithAi));

quizRouter.get("/problems/:stageId", asyncHandler(getQuizProblems));
quizRouter.get(
  "/problem/:questionIndex/stage/:stageId",
  asyncHandler(getQuizProblemById)
);
quizRouter.put("/problem", asyncHandler(updateQuizProblem));
quizRouter.post("/problem/:quizId", asyncHandler(createQuizProblem));

export { quizRouter };
