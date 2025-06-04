import type { Request, Response } from "express";
import { db } from "../../../db/db";
import { admins, jobs } from "../../../db/schema";
import { eq } from "drizzle-orm";
import {
  AppError,
  BadRequestError,
  InternalServerError,
  UnauthorizedError,
} from "../../../utils/errors";
import { zCreateJobInput } from "./types/create-job.input";

export const createJob = async (req: Request, res: Response): Promise<any> => {
  const parsed = zCreateJobInput.safeParse(req.body);

  if (!parsed.success) {
    throw new BadRequestError(JSON.stringify(parsed.error.message));
  }

  if (!req.user || req.user.type !== "admin") {
    throw new UnauthorizedError("Unauthorized action to create job");
  }

  try {
    const admin = (
      await db.select().from(admins).where(eq(admins.id, req.user.id)).limit(1)
    )[0];

    if (!admin?.organizationId) {
      throw new BadRequestError("User is not associated with any organization");
    }

    const job = (
      await db
        .insert(jobs)
        .values({
          title: parsed.data.title,
          slug: parsed.data.slug,
          description: parsed.data.description,
          location: parsed.data.location,
          type: parsed.data.type,
          status: parsed.data.status,
          screeningType: parsed.data.screeningType,
          tags: parsed.data.tags,
          organizationId: admin.organizationId,
          endDate: parsed.data.endDate,
        })
        .returning()
    )[0];

    return res.status(201).json({
      message: "Job created successfully",
      data: job,
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    console.error(error);

    throw new InternalServerError();
  }
};
