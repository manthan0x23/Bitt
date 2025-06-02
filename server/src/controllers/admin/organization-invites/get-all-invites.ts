import type { Request, Response } from "express";
import { db } from "../../../db/db";
import { admins, organizationInvite } from "../../../db/schema";
import { and, desc, eq, not } from "drizzle-orm";
import {
  AppError,
  BadRequestError,
  InternalServerError,
  UnauthorizedError,
} from "../../../utils/errors";

export const getAllOrganizationInvites = async (
  req: Request,
  res: Response
): Promise<any> => {
  if (!req.user || req.user.type !== "admin") {
    throw new UnauthorizedError("Unauthorized");
  }

  try {
    const admin = (
      await db
        .select()
        .from(admins)
        .where(eq(admins.workEmail, req.user.email))
        .limit(1)
    )[0];

    if (!admin?.organizationId) {
      throw new BadRequestError("User not linked to any organization");
    }

    const invites = await db
      .select()
      .from(organizationInvite)
      .where(
        and(
          not(eq(organizationInvite.status, "deleted")),
          eq(organizationInvite.organizationId, admin.organizationId)
        )
      )
      .orderBy(desc(organizationInvite.updatedAt));

    return res.status(200).json({
      message: "Organization invites fetched",
      data: invites,
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new InternalServerError();
  }
};
