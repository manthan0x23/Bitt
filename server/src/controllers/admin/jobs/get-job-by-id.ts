// handlers/get-job-by-id.ts
import type { Request, Response } from "express";
import { db } from "../../../db/db";
import { admins, jobs, contests } from "../../../db/schema"; // Added contests import
import { eq, asc } from "drizzle-orm"; // Added asc for ordering
import {
  AppError,
  BadRequestError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from "../../../utils/errors";
import { stages } from "../../../db/schema/stages";

export const getJobById = async (req: Request, res: Response): Promise<any> => {
  const { id: jobId } = req.params;
  if (!jobId) {
    throw new BadRequestError("Job ID is required in path parameters.");
  }

  if (!req.user || req.user.type !== "admin") {
    throw new UnauthorizedError("Unauthorized action to get job details");
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
      await db.select().from(jobs).where(eq(jobs.id, jobId)).limit(1)
    )[0];

    if (!job) {
      throw new NotFoundError("Job not found");
    }

    if (job.organizationId !== admin.organizationId) {
      throw new UnauthorizedError("Admin is not authorized to view this job");
    }

    const jobStages = await db
      .select()
      .from(stages)
      .where(eq(stages.jobId, jobId))
      .orderBy(asc(stages.stageIndex));

    const jobWithContests = {
      ...job,
      stages: jobStages,
    };

    return res.status(200).json({
      message: "Job fetched successfully",
      data: jobWithContests,
    });
  } catch (error) {
    console.log(error);

    if (error instanceof AppError) {
      throw error;
    }
    throw new InternalServerError(
      "An unexpected error occurred while fetching the job."
    );
  }
};
