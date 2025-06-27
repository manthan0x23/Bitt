import type { Request, Response } from "express";
import { db } from "../../../../db/db";
import { admins, organizations, roles } from "../../../../db/schema";
import { asc, desc, eq } from "drizzle-orm";
import {
  AppError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from "../../../../utils/errors";

export const getOrganizationRoles = async (req: Request, res: Response) => {
  if (!req.user || req.user.type !== "admin") {
    throw new UnauthorizedError("Unauthorized action to get organization");
  }

  try {
    const admin = (
      await db.select().from(admins).where(eq(admins.id, req.user.id)).limit(1)
    )[0];

    if (!admin.organizationId) {
      return res.status(207).json({
        message: "Admin doesnt belong to any organization.",
        data: null,
      });
    }

    const organization = (
      await db
        .selectDistinct()
        .from(organizations)
        .where(eq(organizations.id, admin.organizationId))
        .limit(1)
    )[0];

    if (!organization) {
      throw new NotFoundError("Organization not found");
    }

    const roles_ = await db
      .select()
      .from(roles)
      .where(eq(roles.organizationId, organization.id))
      .orderBy(desc(roles.isTemplate));

    return res.status(200).json({
      message: "Roles fetched successfully",
      data: roles_,
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new InternalServerError();
  }
};
