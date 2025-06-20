import type { Request, Response } from "express";
import { db } from "../../../../db/db";
import {
  admins,
  organizationInvite,
  organizations,
  roles,
} from "../../../../db/schema";
import { and, eq } from "drizzle-orm";
import { scrapeLogoUrl } from "../../../../utils/integrations/logo-scrapper";
import {
  AppError,
  BadRequestError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from "../../../../utils/errors";
import { zCreateOrganizationInviteInput } from "./types/create-invite.input";
import { shortId } from "../../../../utils/integrations/short-id";

export const createOrganizationInvite = async (
  req: Request,
  res: Response
): Promise<any> => {
  const parsed = zCreateOrganizationInviteInput.safeParse(req.body);
  if (parsed.error) {
    throw new BadRequestError(JSON.stringify(parsed.error.message));
  }

  if (!req.user || req.user.type !== "admin") {
    throw new UnauthorizedError("Unauthorized action to create organization");
  }

  try {
    const [admin] = await db
      .selectDistinct()
      .from(admins)
      .where(eq(admins.workEmail, req.user.email))
      .limit(1);

    if (!admin || !admin.organizationId) {
      throw new BadRequestError("User is not associated with any organization");
    }

    const [organization] = await db
      .selectDistinct()
      .from(organizations)
      .where(eq(organizations.id, admin.organizationId))
      .limit(1);

    if (!organization) {
      throw new NotFoundError("Organization admin belongs to not found");
    }

    let role: typeof roles.$inferSelect | null = null;

    const inviteCode = shortId();

    if (parsed.data.roleType == "custom") {
      const { roleTag, roleCapabilities, roleIsTemplate, roleColorScheme } =
        parsed.data;
        
      [role] = await db
        .insert(roles)
        .values({
          tag: roleTag!,
          capabilities: roleCapabilities!,
          isTemplate: roleIsTemplate!,
          colorScheme: roleColorScheme!,
          organizationId: organization.id,
        })
        .returning();
    }

    let roleId = parsed.data.roleId;
    if (role) roleId = role.id;

    const invite = (
      await db
        .insert(organizationInvite)
        .values({
          code: inviteCode,
          organizationId: admin.organizationId,
          allowedOrigins: parsed.data.allowedOrigins,
          inviteType: parsed.data.inviteType,
          usageLimit: parsed.data.usageLimit,
          roleId: roleId,
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
    console.log(error);

    if (error instanceof AppError) {
      throw error;
    }
    throw new InternalServerError();
  }
};
