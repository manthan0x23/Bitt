import type { Request, Response } from "express";
import {
  AppError,
  BadRequestError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from "../../../../../utils/errors";
import { db } from "../../../../../db/db";
import {
  admins,
  jobs,
  quizes,
  quizProblems,
  stages,
} from "../../../../../db/schema";
import { eq } from "drizzle-orm";
import { zUpdateProblemInput } from "./types/update-quiz-problems-input";

export const updateQuizProblem = async (req: Request, res: Response): Promise<any> => {
  const parsed = zUpdateProblemInput.safeParse(req.body);
  if (!parsed.success) {
    console.error("Validation Error:", parsed.error.format());
    throw new BadRequestError("Invalid input. Please check the form data.");
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

    const [result] = await db
      .select({
        problem: quizProblems,
        quiz: quizes,
        stage: stages,
        job: jobs,
      })
      .from(quizProblems)
      .innerJoin(quizes, eq(quizProblems.quizId, quizes.id))
      .innerJoin(stages, eq(quizes.stageId, stages.id))
      .innerJoin(jobs, eq(stages.jobId, jobs.id))
      .where(eq(quizProblems.id, parsed.data.id));

    if (!result) {
      throw new NotFoundError("Quiz problem not found.");
    }

    const { job } = result;

    if (job.organizationId !== admin.organizationId) {
      throw new UnauthorizedError(
        "You are not authorized to update this quiz problem."
      );
    }

    const now = new Date();
    const updateData =
      parsed.data.type === "text"
        ? {
            ...parsed.data,
            answer: null,
            choices: null,
            updatedAt: now,
          }
        : {
            ...parsed.data,
            textAnswer: null,
            updatedAt: now,
          };

    const [updated] = await db
      .update(quizProblems)
      .set(updateData)
      .where(eq(quizProblems.id, parsed.data.id))
      .returning();

    return res.status(200).json({
      message: `Problem ${updated.questionIndex} updated successfully`,
      data: updated,
    });
  } catch (err) {
    console.error("Update Quiz Error:", err);
    if (err instanceof AppError) throw err;
    throw new InternalServerError("Unexpected error during quiz update.");
  }
};
