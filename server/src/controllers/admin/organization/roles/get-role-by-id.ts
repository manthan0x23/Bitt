import type { Request, Response } from "express";
import { db } from "../../../../db/db";
import { admins, organizations, roles } from "../../../../db/schema";
import { and, asc, eq } from "drizzle-orm";
import {
  AppError,
  BadRequestError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from "../../../../utils/errors";
import z from "zod/v4";

export const getOrganizationRoleById = async (req: Request, res: Response) => {
  const parsed = z
    .object({
      roleId: z.string().min(1),
    })
    .safeParse(req.params);

  if (parsed.error) {
    throw new BadRequestError(parsed.error.message);
  }

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

    const [role] = await db
      .select()
      .from(roles)
      .where(
        and(
          eq(roles.organizationId, organization.id),
          eq(roles.id, parsed.data.roleId)
        )
      )
      .limit(1);

    if (!role) {
      throw new NotFoundError("Role not found");
    }

    return res.status(200).json({
      message: "Role fetched successfully",
      data: role,
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new InternalServerError();
  }
};
