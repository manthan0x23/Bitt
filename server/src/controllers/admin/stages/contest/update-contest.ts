import type { Request, Response } from "express";
import { db } from "../../../../db/db";
import {
  admins,
  contests,
  contestProblems,
  jobs,
  stages,
} from "../../../../db/schema";
import { asc, eq } from "drizzle-orm";
import {
  AppError,
  BadRequestError,
  InternalServerError,
  UnauthorizedError,
} from "../../../../utils/errors";
import { zUpdateContestInput } from "./types/update-quiz-input";

export const updateContest = async (
  req: Request,
  res: Response
): Promise<any> => {
  const parsed = zUpdateContestInput.safeParse(req.body);

  if (!parsed.success) {
    throw new BadRequestError(parsed.error.issues.join(" , "));
  }

  const { data } = parsed;

  if (!req.user || req.user.type !== "admin") {
    throw new UnauthorizedError(
      "You are not authorized to update this contest."
    );
  }

  try {
    const [admin] = await db
      .select({ organizationId: admins.organizationId })
      .from(admins)
      .where(eq(admins.id, req.user.id));

    if (!admin?.organizationId) {
      throw new BadRequestError("Admin does not belong to any organization.");
    }

    const [result] = await db
      .select({
        contest: contests,
        stage: stages,
        job: jobs,
      })
      .from(contests)
      .innerJoin(stages, eq(contests.id, stages.id))
      .innerJoin(jobs, eq(stages.jobId, jobs.id))
      .where(eq(contests.id, data.id))
      .limit(1);

    if (!result) {
      throw new BadRequestError(
        "Contest or its associated stage/job not found."
      );
    }

    if (result.job.organizationId !== admin.organizationId) {
      throw new UnauthorizedError(
        "You are not authorized to modify this contest."
      );
    }

    const contest = result.contest;

    const problems = await db
      .select()
      .from(contestProblems)
      .where(eq(contestProblems.contestId, contest.id))
      .orderBy(asc(contestProblems.problemIndex));

    const warnings = [...(contest.warnings ?? [])];
    if (data.noOfProblems < problems.length) {
      warnings.push(
        "The number of associated problems exceeds the required number. Please delete the extra problems before the contest starts, otherwise the system will automatically remove the last problems from the list."
      );
    }

    const updatePayload: Partial<typeof contests.$inferInsert> = {
      ...data,
      warnings,
      updatedAt: new Date(),
      isIndependent: !contest.stageId,
      stageId: contest.stageId ? data.stageId : null,
    };

    if (contest.stageId && !data.stageId) {
      throw new BadRequestError("Stage ID is required for this contest.");
    }

    const [updatedContest] = await db
      .update(contests)
      .set(updatePayload)
      .where(eq(contests.id, data.id))
      .returning();

    return res.status(200).json({
      message: "Contest updated successfully.",
      data: updatedContest,
    });
  } catch (error) {
    console.error("Error in updateContest:", error);
    if (error instanceof AppError) throw error;
    throw new InternalServerError("Unexpected error while updating contest.");
  }
};
