import type { Request, Response } from "express";
import {
  AppError,
  BadRequestError,
  InternalServerError,
  UnauthorizedError,
} from "../../../../../utils/errors";
import { admins, contestProblems, contests } from "../../../../../db/schema";
import { db } from "../../../../../db/db";
import { asc, eq } from "drizzle-orm";
import z from "zod/v4";
import { refineContestProblem } from "./utils/refine-problem";

export const getContestProblems = async (
  req: Request,
  res: Response
): Promise<any> => {
  const parsed = z
    .object({
      stageId: z
        .string()
        .min(1, "StageId is required to retrieve contest realted data"),
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

    if (!admin.organizationId)
      throw new BadRequestError("Admins doest belong to any organizaiton");

    const [contest] = await db
      .select()
      .from(contests)
      .where(eq(contests.stageId, parsed.data.stageId))
      .limit(1);

    const problems = await db
      .select()
      .from(contestProblems)
      .where(eq(contestProblems.contestId, contest.id))
      .orderBy(asc(contestProblems.problemIndex));

    const problemsWithWarnings =
      problems.length > 0
        ? problems.map((problem) => refineContestProblem(problem))
        : null;

    return res.status(200).json({
      message: "Contest problems retrieved successfully",
      data: problemsWithWarnings,
    });
  } catch (error) {
    console.error(error);
    if (error instanceof AppError) throw error;
    throw new InternalServerError("Unexpected error during stage creation.");
  }
};
