// handlers/update-job.ts
import type { Request, Response } from "express";
import { db } from "../../../db/db";
import { admins, jobs } from "../../../db/schema";
import { and, eq } from "drizzle-orm";
import {
  AppError,
  BadRequestError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from "../../../utils/errors";
import { zUpdateJobInput } from "./types/update-job.input";

export const updateJob = async (req: Request, res: Response): Promise<any> => {
  const { id: jobId } = req.params;
  if (!jobId) {
    throw new BadRequestError("Job ID is required in path parameters.");
  }

  const parsed = zUpdateJobInput.safeParse(req.body);
  if (parsed.error) {
    throw new BadRequestError(JSON.stringify(parsed.error.errors.flat()));
  }

  if (!req.user || req.user.type !== "admin") {
    throw new UnauthorizedError("Unauthorized action to update job");
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

    const existingJob = (
      await db
        .select({ id: jobs.id, organizationId: jobs.organizationId })
        .from(jobs)
        .where(eq(jobs.id, jobId))
        .limit(1)
    )[0];

    if (!existingJob) {
      throw new NotFoundError("Job not found");
    }

    if (existingJob.organizationId !== admin.organizationId) {
      throw new UnauthorizedError("Admin is not authorized to update this job");
    }

    if (Object.keys(parsed.data).length === 0) {
      throw new BadRequestError("No fields provided for update.");
    }

    const updatedJob = (
      await db
        .update(jobs)
        .set({
          ...parsed.data,
          updatedAt: new Date(),
        })
        .where(
          and(eq(jobs.id, jobId), eq(jobs.organizationId, admin.organizationId))
        )
        .returning()
    )[0];

    if (!updatedJob) {
      throw new InternalServerError("Failed to update job");
    }

    return res.status(200).json({
      message: "Job updated successfully",
      data: updatedJob,
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new InternalServerError(
      "An unexpected error occurred while updating the job."
    );
  }
};
