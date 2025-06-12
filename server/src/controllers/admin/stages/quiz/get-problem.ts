import type { Request, Response } from "express";
import { db } from "../../../../db/db";
import { quizes, admins, stages, quizProblems } from "../../../../db/schema";
import { and, asc, eq } from "drizzle-orm";
import {
  AppError,
  BadRequestError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from "../../../../utils/errors";
import z from "zod/v4";

export const getQuizProblemById = async (
  req: Request,
  res: Response
): Promise<any> => {
  const parsed = z
    .object({
      stageId: z.string().min(1, "StageId is required in parameter"),
      questionIndex: z
        .string()
        .min(1, "Question Index is required in parameter")
        .transform((val, ctx) => {
          const parsed = Number(val);
          if (!Number.isInteger(parsed) || parsed < 0) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Question Index must be a non-negative integer",
            });
            return z.NEVER;
          }
          return parsed;
        }),
    })
    .safeParse(req.params);

  if (parsed.error) {
    throw new BadRequestError(parsed.error.message);
  }

  if (!req.user || req.user.type !== "admin") {
    throw new UnauthorizedError("Unauthorized to create stage");
  }

  try {
    const [admin] = await db
      .select({
        organizationId: admins.organizationId,
      })
      .from(admins)
      .where(eq(admins.id, req.user.id));

    if (!admin.organizationId) {
      throw new BadRequestError("Admins doest belong to any organizaiton");
    }

    const [stage] = await db
      .select()
      .from(stages)
      .where(eq(stages.id, parsed.data.stageId));

    if (!stage || stage.type != "quiz" || !stage.secondTableId) {
      throw new NotFoundError("Quiz stage not found !");
    }

    const [quiz] = await db
      .select()
      .from(quizes)
      .where(eq(quizes.id, stage.secondTableId));

    const [problem] = await db
      .select()
      .from(quizProblems)
      .where(
        and(
          eq(quizProblems.quizId, quiz.id),
          eq(quizProblems.questionIndex, parsed.data.questionIndex)
        )
      )
      .limit(1);

    if (!problem)
      return res.status(200).json({
        message: `Problem doesn't exists.`,
        data: null,
      });
    else
      return res.status(200).json({
        message: `Problem : ${parsed.data.questionIndex} retrieved successfully.`,
        data: problem,
      });
  } catch (error) {
    console.error(error);
    if (error instanceof AppError) throw error;
    throw new InternalServerError("Unexpected error during stage creation.");
  }
};
