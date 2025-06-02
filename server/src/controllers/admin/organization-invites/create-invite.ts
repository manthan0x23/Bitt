import type { Request, Response } from "express";
import { db } from "../../../db/db";
import { admins, organizationInvite, organizations } from "../../../db/schema";
import { and, eq } from "drizzle-orm";
import { scrapeLogoUrl } from "../../../utils/integrations/logo-scrapper";
import {
  AppError,
  BadRequestError,
  InternalServerError,
  UnauthorizedError,
} from "../../../utils/errors";
import { zCreateOrganizationInviteInput } from "./types/create-invite.invite";

export const createOrganizationInvite = async (
  req: Request,
  res: Response
): Promise<any> => {
  const parsed = zCreateOrganizationInviteInput.safeParse(req.body);
  if (!parsed.success) {
    throw new BadRequestError(JSON.stringify(parsed.error.errors.flat()));
  }

  if (!req.user || req.user.type !== "admin") {
    throw new UnauthorizedError("Unauthorized action to create organization");
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
      throw new BadRequestError("User is not associated with any organization");
    }

    const invite = (
      await db
        .insert(organizationInvite)
        .values({
          organizationId: admin.organizationId,
          allowedOrigins: parsed.data.allowedOrigins,
          inviteType: parsed.data.inviteType,
          usageLimit: parsed.data.usageLimit,
          endDate: new Date(parsed.data.endDate),
          createdBy: admin.id,
        })
        .returning()
    )[0];

    return res.status(200).json({
      message: "Invite created successfully",
      data: invite,
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new InternalServerError();
  }
};
