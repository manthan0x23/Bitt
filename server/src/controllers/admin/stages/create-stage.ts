import type { Request, Response } from "express";
import { db } from "../../../db/db";
import { admins, jobs, stages } from "../../../db/schema";
import { eq } from "drizzle-orm";
import {
  AppError,
  BadRequestError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from "../../../utils/errors";
import { zCreateStageInput } from "./types/create-stage.input";

export const createStage = async (
  req: Request,
  res: Response
): Promise<any> => {
  const parsed = zCreateStageInput.safeParse(req.body);

  if (!parsed.success) {
    console.log(parsed.error);

    throw new BadRequestError(parsed.error.message);
  }

  if (!req.user || req.user.type !== "admin") {
    throw new UnauthorizedError("Unauthorized to create stage");
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
      throw new NotFoundError("Job not found");
    }

    if (job.organizationId !== admin.organizationId) {
      throw new UnauthorizedError(
        "You are not authorized to add a stage to this job"
      );
    }

    function toValidDate(value?: string | null): Date {
      if (!value) return new Date();
      const date = new Date(value);
      return isNaN(date.getTime()) ? new Date() : date;
    }

    const insertData = {
      ...parsed.data,
      startAt: toValidDate(parsed.data.startAt),
      endAt: toValidDate(parsed.data.endAt),
    };

    const newStage = await db.insert(stages).values(insertData).returning();

    return res.status(201).json({
      message: "Stage created successfully",
      data: newStage,
    });
  } catch (error) {
    console.error(error);

    if (error instanceof AppError) throw error;
    throw new InternalServerError("Unexpected error during stage creation.");
  }
};
