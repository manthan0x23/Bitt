import type { Request, Response } from "express";
import { db } from "../../../../db/db";
import { admins, organizations, roles } from "../../../../db/schema";
import { asc, eq } from "drizzle-orm";
import {
  AppError,
  BadRequestError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from "../../../../utils/errors";
import { zUpdateRoleInput } from "./types/update-org-role.input";

export const updateOrganizationRole = async (req: Request, res: Response) => {
  const parsed = zUpdateRoleInput.safeParse(req.body);

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

    let [role] = await db
      .selectDistinct()
      .from(roles)
      .where(eq(roles.id, parsed.data.id))
      .limit(1);

    const updateData: typeof roles.$inferInsert = {
      id: role.id,
      organizationId: role.organizationId,
      tag: parsed.data.tag ?? role.tag,
      capabilities: parsed.data.capabilities ?? role.capabilities,
      colorScheme: parsed.data.colorScheme ?? role.colorScheme,
      isTemplate: parsed.data.isTemplate ?? role.isTemplate,
    };

    [role] = await db
      .update(roles)
      .set(updateData)
      .where(eq(roles.id, parsed.data.id))
      .returning();

    return res.status(200).json({
      message: "Role updates successfully",
      data: role,
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new InternalServerError();
  }
};
