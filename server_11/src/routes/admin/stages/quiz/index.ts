import { Router } from "express";
import { asyncHandler } from "../../../../middlewares/handlers/async-handler";
import { getQuiz } from "../../../../controllers/admin/stages/quiz/get-quiz";
import { updateQuiz } from "../../../../controllers/admin/stages/quiz/update-quiz";
import { getQuizProblemById } from "../../../../controllers/admin/stages/quiz/problems/get-problem";
import { createQuizProblem } from "../../../../controllers/admin/stages/quiz/problems/create-quiz-problem";
import { updateQuizProblem } from "../../../../controllers/admin/stages/quiz/problems/update-problem";
import { getQuizProblems } from "../../../../controllers/admin/stages/quiz/problems/get-quiz-problems";
import { generateQuizWithAi } from "../../../../controllers/admin/stages/quiz/problems/generate-with-ai";
import { capabilitiesMap } from "../../../../utils/types/admin-capabilities";
import { requiresCapability } from "../../../../middlewares/authorize-admin";

const quizRouter = Router();

quizRouter
  .get(
    "/get/:stageId",
    requiresCapability(capabilitiesMap.quiz.read),
    asyncHandler(getQuiz)
  )
  .post(
    "/update",
    requiresCapability(capabilitiesMap.quiz.update),
    asyncHandler(updateQuiz)
  )
  .put(
    "/generate/:stageId",
    requiresCapability(capabilitiesMap.quiz.generate),
    asyncHandler(generateQuizWithAi)
  );

// quiz problems
quizRouter
  .get(
    "/problems/:stageId",
    requiresCapability(capabilitiesMap.quizProblem.read),
    asyncHandler(getQuizProblems)
  )
  .get(
    "/problem/:questionIndex/stage/:stageId",
    requiresCapability(capabilitiesMap.quizProblem.read),
    asyncHandler(getQuizProblemById)
  )
  .put(
    "/problem",
    requiresCapability(capabilitiesMap.quizProblem.update),
    asyncHandler(updateQuizProblem)
  )
  .post(
    "/problem/:quizId",
    requiresCapability(capabilitiesMap.quizProblem.create),
    asyncHandler(createQuizProblem)
  );

export { quizRouter };
