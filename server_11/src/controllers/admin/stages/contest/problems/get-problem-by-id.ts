import type { Request, Response } from "express";
import {
  AppError,
  BadRequestError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from "../../../../../utils/errors";
import { admins, contestProblems, contests } from "../../../../../db/schema";
import { db } from "../../../../../db/db";
import { and, asc, eq } from "drizzle-orm";
import z from "zod/v4";
import { problemSchema } from "./utils/refine-problem";
import { extractSchemaErrors } from "../../../../../utils/validation/generic-validator";

export const getContestProblemsById = async (
  req: Request,
  res: Response
): Promise<any> => {
  const parsed = z
    .object({
      stageId: z
        .string()
        .min(1, "StageId is required to retrieve contest realted data"),
      problemIndex: z
        .string()
        .min(1, "Problem index is required")
        .transform((v) => {
          const n = Number(v);
          if (Number.isNaN(n))
            throw new Error("Problem index must be a valid number");
          return n;
        })
        .pipe(z.number().int().nonnegative("Problem index must be ≥ 0")),
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

    const [problem] = await db
      .select()
      .from(contestProblems)
      .where(
        and(
          eq(contestProblems.contestId, contest.id),
          eq(contestProblems.problemIndex, parsed.data.problemIndex)
        )
      )
      .limit(1);

    if (!problem || !problem.id) {
      throw new NotFoundError("Problem not found !");
    }

    const warnings = extractSchemaErrors(problem, problemSchema);

    return res.status(200).json({
      message: "Contest problems retrieved successfully",
      data: { ...problem, warnings },
    });
  } catch (error) {
    console.error(error);
    if (error instanceof AppError) throw error;
    throw new InternalServerError("Unexpected error during problem retrieval.");
  }
};
