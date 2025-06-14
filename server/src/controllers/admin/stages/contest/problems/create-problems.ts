import type { Request, Response } from "express";
import {
  AppError,
  BadRequestError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from "../../../../../utils/errors";
import {
  admins,
  contestProblems,
  contests,
  stages,
} from "../../../../../db/schema";
import { db } from "../../../../../db/db";
import { desc, eq } from "drizzle-orm";
import { zUpdateProblemInput } from "./types/update-problem-schema";
import { refineContestProblem } from "./utils/refine-problem";
import z from "zod/v4";

export const createContestProblems = async (
  req: Request,
  res: Response
): Promise<any> => {
  const parsed = z
    .object({
      stageId: z
        .string()
        .min(1, "StageId is required to create contest problem"),
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
        id: admins.id,
        organizationId: admins.organizationId,
      })
      .from(admins)
      .where(eq(admins.id, req.user.id));

    if (!admin.organizationId)
      throw new BadRequestError("Admins doest belong to any organizaiton");

    const [stage] = await db
      .select()
      .from(stages)
      .where(eq(stages.id, parsed.data.stageId))
      .limit(1);

    if (!stage || !stage.secondTableId) {
      throw new BadRequestError("Stage not linked to any contest!");
    }

    const [contest] = await db
      .select()
      .from(contests)
      .where(eq(contests.id, stage.secondTableId))
      .limit(1);

    if (contest.organizationId != admin.organizationId) {
      throw new UnauthorizedError(
        "Your organization is not authorized to configure this contest."
      );
    }

    const [problem] = await db
      .select()
      .from(contestProblems)
      .where(eq(contestProblems.contestId, contest.id))
      .orderBy(desc(contestProblems.problemIndex))
      .limit(1);

    const problemIndex = problem ? problem.problemIndex : 0;

    const [newProblem] = await db
      .insert(contestProblems)
      .values({
        contestId: contest.id,
        problemIndex: problemIndex + 1,
        authorIds: [admin.id],
        title: "",
        description: "",
      })
      .returning();

    return res.status(200).json({
      message: "Problem created successfully",
      data: newProblem.problemIndex,
    });
  } catch (error) {
    console.error(error);
    if (error instanceof AppError) throw error;
    throw new InternalServerError("Unexpected error during stage creation.");
  }
};
