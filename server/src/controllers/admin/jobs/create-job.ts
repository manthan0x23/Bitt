import type { Request, Response } from "express";
import { db } from "../../../db/db";
import { admins, jobs, stages } from "../../../db/schema";
import { eq } from "drizzle-orm";
import {
  AppError,
  BadRequestError,
  InternalServerError,
  UnauthorizedError,
} from "../../../utils/errors";
import { zCreateJobInput } from "./types/create-job.input";
import { anYearLater } from "../../../utils/date-time/an-year-later";

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
          status: "draft",
          screeningType: parsed.data.screeningType,
          tags: parsed.data.tags,
          organizationId: admin.organizationId,
          endDate: parsed.data.endDate,
          resumeRequired: parsed.data.resumeRequired,
          coverLetterRequired: parsed.data.coverLetterRequired,
          isCreationComplete: false,
          experience: parsed.data.experience,
          openings: parsed.data.openings,
        })
        .returning()
    )[0];

    if (parsed.data.screeningType === "application") {
      const anYearLater__ = anYearLater();
      await db.transaction(async (tx) => {
        await tx.insert(stages).values([
          {
            jobId: job.id,
            startAt: new Date(),
            endAt: anYearLater__,
            stageIndex: 1,
            type: "resume_filter",
            selectType: "strict",
            isFinal: true,
            inflow: 2000,
            outflow: 100,
            description: "AI based resume filteration",
            selectionCriteria: "automatic",
          },
          {
            jobId: job.id,
            startAt: new Date(),
            endAt: anYearLater__,
            stageIndex: 2,
            type: "interview",
            selectType: "relax",
            isFinal: true,
            inflow: 100,
            outflow: job.openings,
            description: "Final candidates interview",
            selectionCriteria: "automatic",
          },
        ]);

        await tx
          .update(jobs)
          .set({
            isCreationComplete: true,
            status: "open",
          })
          .where(eq(jobs.id, job.id));
      });
    }

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
