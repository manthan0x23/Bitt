// handlers/get-organization-jobs.ts
import type { Request, Response } from "express";
import { db } from "../../../db/db";
import { admins, jobs } from "../../../db/schema";
import { desc, eq } from "drizzle-orm";
import {
  AppError,
  BadRequestError,
  InternalServerError,
  UnauthorizedError,
} from "../../../utils/errors";

export const getOrganizationJobs = async (
  req: Request,
  res: Response
): Promise<any> => {
  if (!req.user || req.user.type !== "admin") {
    throw new UnauthorizedError("Unauthorized action to get organization jobs");
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

    const organizationJobs = await db
      .select()
      .from(jobs)
      .where(eq(jobs.organizationId, admin.organizationId))
      .orderBy(desc(jobs.updatedAt));

    return res.status(200).json({
      message: "Jobs fetched successfully for the organization",
      data: organizationJobs,
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new InternalServerError(
      "An unexpected error occurred while fetching organization jobs."
    );
  }
};
