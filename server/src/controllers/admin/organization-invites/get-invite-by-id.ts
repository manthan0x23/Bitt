import type { Request, Response } from "express";
import { db } from "../../../db/db";
import { admins, organizationInvite } from "../../../db/schema";
import { and, eq, not } from "drizzle-orm";
import {
  AppError,
  BadRequestError,
  InternalServerError,
  UnauthorizedError,
} from "../../../utils/errors";

export const getOrganizationInviteById = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { inviteId } = req.params;

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

    const invite = (
      await db
        .select()
        .from(organizationInvite)
        .where(
          and(
            not(eq(organizationInvite.status, "deleted")),
            eq(organizationInvite.id, inviteId)
          )
        )
        .limit(1)
    )[0];

    if (!invite) {
      throw new BadRequestError("Invite not found");
    }

    if (invite.organizationId !== admin.organizationId) {
      throw new UnauthorizedError(
        "Access denied: invite not in your organization"
      );
    }

    return res.status(200).json({
      message: "Invite found",
      data: invite,
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new InternalServerError();
  }
};
