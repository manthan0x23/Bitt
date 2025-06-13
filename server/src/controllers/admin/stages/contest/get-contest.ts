import type { Request, Response } from "express";
import { db } from "../../../../db/db";
import {
  admins,
  stages,
  contests,
  contestProblems,
} from "../../../../db/schema";
import { eq } from "drizzle-orm";
import {
  AppError,
  BadRequestError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from "../../../../utils/errors";

export const getContest = async (req: Request, res: Response): Promise<any> => {
  const { stageId } = req.params;

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
      .where(eq(stages.id, stageId));

    if (!stage || stage.type != "quiz" || !stage.secondTableId) {
      throw new NotFoundError("Quiz stage not found !");
    }

    const [contest] = await db
      .select()
      .from(contests)
      .where(eq(contests.id, stage.secondTableId));

    const problems = await db
      .select()
      .from(contestProblems)
      .where(eq(contestProblems.contestId, contest.id));

    return res.status(200).json({
      message: "Contest retrieved successfully.",
      data: { ...contest, problemCount: problems.length },
    });
  } catch (error) {
    console.error(error);
    if (error instanceof AppError) throw error;
    throw new InternalServerError("Unexpected error during stage creation.");
  }
};
