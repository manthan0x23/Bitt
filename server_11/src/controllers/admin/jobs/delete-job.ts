// handlers/delete-job.ts
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

export const deleteJob = async (req: Request, res: Response): Promise<any> => {
  const { id: jobId } = req.params;
  if (!jobId) {
    throw new BadRequestError("Job ID is required in path parameters.");
  }

  if (!req.user || req.user.type !== "admin") {
    throw new UnauthorizedError("Unauthorized action to delete job");
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
      throw new UnauthorizedError("Admin is not authorized to delete this job");
    }

    const result = await db
      .delete(jobs)
      .where(
        and(eq(jobs.id, jobId), eq(jobs.organizationId, admin.organizationId))
      )
      .returning({ id: jobs.id });

    if (result.length === 0) {
      throw new NotFoundError(
        "Job not found or already deleted, or admin not authorized."
      );
    }

    return res.status(200).json({
      message: "Job deleted successfully",
      data: { id: jobId },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new InternalServerError(
      "An unexpected error occurred while deleting the job."
    );
  }
};
