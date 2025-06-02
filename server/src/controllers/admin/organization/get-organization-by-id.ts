import type { Request, Response } from "express";
import { db } from "../../../db/db";
import { admins, organizations } from "../../../db/schema";
import { eq } from "drizzle-orm";
import {
  AppError,
  BadRequestError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from "../../../utils/errors";

export const getOrganizationById = async (req: Request, res: Response) => {
  if (!req.user || req.user.type !== "admin") {
    throw new UnauthorizedError("Unauthorized action to get organization");
  }

  try {
    const admin = (
      await db.select().from(admins).where(eq(admins.id, req.user.id)).limit(1)
    )[0];

    if (!admin.organizationId) {
      throw new BadRequestError("Admin doesnt belong to any organization.");
    }

    const organization = (
      await db
        .select()
        .from(organizations)
        .where(eq(organizations.id, admin.organizationId))
        .limit(1)
    )[0];

    if (!organization) {
      throw new NotFoundError("Organization not found");
    }

    return res.status(200).json({
      message: "Organization fetched successfully",
      organization,
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new InternalServerError();
  }
};
