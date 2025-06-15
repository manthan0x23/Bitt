import { Router } from "express";
import { asyncHandler } from "../../../../middlewares/handlers/async-handler";
import { getQuiz } from "../../../../controllers/admin/stages/quiz/get-quiz";
import { updateQuiz } from "../../../../controllers/admin/stages/quiz/update-quiz";
import { getQuizProblemById } from "../../../../controllers/admin/stages/quiz/problems/get-problem";
import { createQuizProblem } from "../../../../controllers/admin/stages/quiz/problems/create-quiz-problem";
import { updateQuizProblem } from "../../../../controllers/admin/stages/quiz/problems/update-problem";
import { getQuizProblems } from "../../../../controllers/admin/stages/quiz/problems/get-quiz-problems";
import { generateQuizWithAi } from "../../../../controllers/admin/stages/quiz/problems/generate-with-ai";

const quizRouter = Router();

quizRouter
  .get("/get/:stageId", asyncHandler(getQuiz))
  .post("/update", asyncHandler(updateQuiz))
  .put("/generate/:stageId", asyncHandler(generateQuizWithAi));

// quiz problems
quizRouter
  .get("/problems/:stageId", asyncHandler(getQuizProblems))
  .get(
    "/problem/:questionIndex/stage/:stageId",
    asyncHandler(getQuizProblemById)
  )
  .put("/problem", asyncHandler(updateQuizProblem))
  .post("/problem/:quizId", asyncHandler(createQuizProblem));

export { quizRouter };
