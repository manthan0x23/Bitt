import type { Request, Response } from "express";
import { db } from "../../../db/db";
import { admins, contests, jobs } from "../../../db/schema";
import { eq } from "drizzle-orm";
import {
  AppError,
  BadRequestError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from "../../../utils/errors";
import { zCreateContestInput } from "./types/create-contest.input";

export const createContest = async (
  req: Request,
  res: Response
): Promise<any> => {
  const parsed = zCreateContestInput.safeParse(req.body);
  if (!parsed.success) {
    throw new BadRequestError(JSON.stringify(parsed.error.errors.flat()));
  }

  if (!req.user || req.user.type !== "admin") {
    throw new UnauthorizedError("Unauthorized action to create contest");
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

    const job = (
      await db
        .select({ id: jobs.id, organizationId: jobs.organizationId })
        .from(jobs)
        .where(eq(jobs.id, parsed.data.jobId))
        .limit(1)
    )[0];

    if (!job) {
      throw new NotFoundError(`Job with ID ${parsed.data.jobId} not found.`);
    }

    if (job.organizationId !== admin.organizationId) {
      throw new UnauthorizedError(
        "Admin is not authorized to create contests for this job."
      );
    }

    const {
      title,
      description,
      stage,
      jobId,
      startAt,
      endAt,
      duration,
      contestType,
      accessibility,
      availableForPractise,
      publishState,
    } = parsed.data;

    const newContest = (
      await db
        .insert(contests)
        .values({
          title,
          description,
          stage,
          jobId,
          startAt: new Date(startAt),
          endAt: new Date(endAt),
          duration,
          contestType,
          accessibility,
          availableForPractise,
          publishState,
        })
        .returning()
    )[0];

    return res.status(201).json({
      message: "Contest created successfully",
      data: newContest,
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new InternalServerError(
      "An unexpected error occurred while creating the contest."
    );
  }
};
