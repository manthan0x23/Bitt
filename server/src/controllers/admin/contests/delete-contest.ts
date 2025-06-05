// handlers/contest/delete-contest.ts
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

export const deleteContest = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id: contestId } = req.params;
  if (!contestId) {
    throw new BadRequestError("Contest ID is required in path parameters.");
  }

  if (!req.user || req.user.type !== "admin") {
    throw new UnauthorizedError("Unauthorized action to delete contest");
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

    const contestToDelete = (
      await db
        .select({
          id: contests.id,
          jobOrganizationId: jobs.organizationId,
        })
        .from(contests)
        .leftJoin(jobs, eq(contests.stageId, jobs.id))
        .where(eq(contests.id, contestId))
        .limit(1)
    )[0];

    if (!contestToDelete) {
      throw new NotFoundError("Contest not found");
    }

    if (contestToDelete.jobOrganizationId !== admin.organizationId) {
      throw new UnauthorizedError(
        "Admin is not authorized to delete this contest."
      );
    }

    const result = await db
      .delete(contests)
      .where(eq(contests.id, contestId))
      .returning({ id: contests.id });

    if (result.length === 0) {
      throw new NotFoundError("Contest not found or already deleted.");
    }

    return res.status(200).json({
      message: "Contest deleted successfully",
      data: { id: contestId },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new InternalServerError(
      "An unexpected error occurred while deleting the contest."
    );
  }
};
