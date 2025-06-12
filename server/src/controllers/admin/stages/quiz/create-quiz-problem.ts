import type { Request, Response } from "express";
import {
  AppError,
  BadRequestError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from "../../../../utils/errors";
import { db } from "../../../../db/db";
import {
  admins,
  jobs,
  quizes,
  quizProblems,
  stages,
} from "../../../../db/schema";
import { eq } from "drizzle-orm";
import z from "zod/v4";

export const createQuizProblem = async (
  req: Request,
  res: Response
): Promise<any> => {
  const parsed = z
    .object({
      quizId: z.string().min(1, "QuizId is required"),
    })
    .safeParse(req.params);

  if (parsed.error) {
    throw new BadRequestError(parsed.error.message);
  }

  const adminId = req.user?.id;
  if (!req.user || req.user.type !== "admin" || !adminId) {
    throw new UnauthorizedError("Only admins can update quiz problems.");
  }

  try {
    const [admin] = await db
      .select({ organizationId: admins.organizationId })
      .from(admins)
      .where(eq(admins.id, adminId));

    if (!admin?.organizationId) {
      throw new BadRequestError("Admin does not belong to any organization.");
    }

    const [quiz] = await db
      .select()
      .from(quizes)
      .where(eq(quizes.id, parsed.data.quizId));

    if (!quiz) {
      throw new NotFoundError("Quiz not found.");
    }

    const quizProblemList = await db
      .select()
      .from(quizProblems)
      .where(eq(quizProblems.quizId, parsed.data.quizId));

    const nextProblemIndex = quizProblemList.length + 1;

    await db.insert(quizProblems).values({
      quizId: quiz.id,
      questionIndex: nextProblemIndex,
    });

    return res.status(200).json({
      message: "New problem created succcessfully",
      data: nextProblemIndex,
    });
  } catch (err) {
    console.error("Create Quiz Problem Error:", err);
    if (err instanceof AppError) throw err;
    throw new InternalServerError("Unexpected error during quiz update.");
  }
};
