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
import { asc, eq } from "drizzle-orm";
import { zUpdateProblemInput } from "./types/update-problem-schema";
import { refineContestProblem } from "./utils/refine-problem";

export const updateContestProblems = async (
  req: Request,
  res: Response
): Promise<any> => {
  const parsed = zUpdateProblemInput.safeParse(req.body);

  if (parsed.error) {
    // @ts-ignore
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

    const [contest] = await db
      .select()
      .from(contests)
      .where(eq(contests.id, parsed.data.contestId))
      .limit(1);

    if (contest.organizationId != admin.organizationId) {
      throw new UnauthorizedError(
        "Your organization is not authorized to configure this contest."
      );
    }

    let [problem] = await db
      .select()
      .from(contestProblems)
      .where(eq(contestProblems.id, parsed.data.id));

    const newAuthorIds = problem.authorIds;

    if (!newAuthorIds.includes(admin.id)) newAuthorIds.push(admin.id);

    [problem] = await db
      .update(contestProblems)
      .set({
        ...parsed.data,
        updatedAt: new Date(),
        authorIds: newAuthorIds,
        examples: [],
      })
      .where(eq(contestProblems.id, problem.id))
      .returning();

    const updatedProblem = refineContestProblem(problem);

    return res.status(200).json({
      message: `Problem ${problem.problemIndex} updated successfully`,
      data: updatedProblem,
    });
  } catch (error) {
    console.error(error);
    if (error instanceof AppError) throw error;
    throw new InternalServerError("Unexpected error during stage creation.");
  }
};
