import type { Request, Response } from "express";
import { db } from "../../../db/db";
import { admins, organizations, roles } from "../../../db/schema";
import { and, eq, isNull } from "drizzle-orm";
import {
  AppError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from "../../../utils/errors";

export const getOrganizationMembers = async (req: Request, res: Response) => {
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
        .select()
        .from(organizations)
        .where(eq(organizations.id, admin.organizationId))
        .limit(1)
    )[0];

    if (!organization) {
      throw new NotFoundError("Organization not found");
    }

    const members = await db
      .select({
        id: admins.id,
        name: admins.name,
        username: admins.username,
        workEmail: admins.workEmail,
        emailVerified: admins.emailVerified,
        accountSource: admins.accountSource,
        pictureurl: admins.logoUrl,
        roleId: admins.roleId,
        createdAt: admins.createdAt,
        updatedAt: admins.updatedAt,
        organizationId: admins.organizationId,

        role: {
          id: roles.id,
          tag: roles.tag,
          capabilities: roles.capabilities,
          colorScheme: roles.colorScheme,
          isTemplate: roles.isTemplate,
        },
      })
      .from(admins)
      .leftJoin(roles, eq(roles.id, admins.roleId))
      .where(
        and(
          eq(admins.organizationId, organization.id),
          isNull(admins.isDeleted)
        )
      );

    return res.status(200).json({
      message: "Organization members fetched successfully",
      data: members,
    });
  } catch (error) {
    console.log(error);

    if (error instanceof AppError) {
      throw error;
    }
    throw new InternalServerError();
  }
};
