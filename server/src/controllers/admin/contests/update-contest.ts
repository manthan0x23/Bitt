// handlers/contest/update-contest.ts
import type { Request, Response } from "express";
import { db } from "../../../db/db";
import { admins, contests, jobs } from "../../../db/schema";
import { and, eq } from "drizzle-orm";
import {
  AppError,
  BadRequestError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from "../../../utils/errors";
import { zUpdateContestInput } from "./types/update-contest.input";

export const updateContest = async (
  req: Request,
  res: Response
): Promise<any> => {
  const parsed = zUpdateContestInput.safeParse(req.body);
  if (!parsed.success) {
    throw new BadRequestError(JSON.stringify(parsed.error.errors.flat()));
  }

  if (Object.keys(parsed.data).length === 0) {
    throw new BadRequestError("No fields provided for update.");
  }

  if (!req.user || req.user.type !== "admin") {
    throw new UnauthorizedError("Unauthorized action to update contest");
  }

  try {
    const admin = (
      await db
        .select({ organizationId: admins.organizationId })
        .from(admins)
        .where(eq(admins.id, req.user.id))
        .limit(1)
    )[0];

    if (!admin?.organizationId) {
      throw new BadRequestError(
        "Admin is not associated with any organization"
      );
    }

    const existingContestData = (
      await db
        .select({
          id: contests.id,
          jobId: contests.jobId,
          stage: contests.stage,
          startAt: contests.startAt,
          endAt: contests.endAt,
          jobOrganizationId: jobs.organizationId,
        })
        .from(contests)
        .leftJoin(jobs, eq(contests.jobId, jobs.id))
        .where(eq(contests.id, parsed.data.id))
        .limit(1)
    )[0];

    if (!existingContestData) {
      throw new NotFoundError("Contest not found");
    }

    if (existingContestData.jobOrganizationId !== admin.organizationId) {
      throw new UnauthorizedError(
        "Admin is not authorized to update this contest."
      );
    }

    const updateData: Partial<typeof contests.$inferInsert> = {
      ...parsed.data,
      startAt: parsed.data.startAt
        ? new Date(parsed.data.startAt)
        : existingContestData.startAt,
      endAt: parsed.data.endAt
        ? new Date(parsed.data.endAt)
        : existingContestData.endAt,
    };

    const updatedContest = (
      await db
        .update(contests)
        .set(updateData)
        .where(eq(contests.id, existingContestData.id))
        .returning()
    )[0];

    if (!updatedContest) {
      throw new InternalServerError("Failed to update contest.");
    }

    return res.status(200).json({
      message: "Contest updated successfully",
      data: updatedContest,
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new InternalServerError(
      "An unexpected error occurred while updating the contest."
    );
  }
};
