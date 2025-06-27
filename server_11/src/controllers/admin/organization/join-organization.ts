import { Request, Response } from "express";
import { zJoinOrganizationInput } from "./types/join-organization.input";
import { db } from "../../../db/db";
import { admins, organizationInvite, roles } from "../../../db/schema";
import { and, eq } from "drizzle-orm";
import {
  AppError,
  BadRequestError,
  InternalServerError,
  UnauthorizedError,
} from "../../../utils/errors";
import { JwtService } from "../../../services/jwt";
import { Env } from "../../../utils/env";

export const joinOrganization = async (
  req: Request,
  res: Response
): Promise<any> => {
  const parsed = zJoinOrganizationInput.safeParse(req.body);

  if (parsed.error) {
    throw new BadRequestError(JSON.stringify(parsed.error.message));
  }

  if (!req.user || req.user.type !== "admin") {
    throw new UnauthorizedError("Unauthorized action to create organization");
  }

  try {
    let code;

    if (parsed.data.link) {
      const inviteLink = new URL(parsed.data.link);
      code = inviteLink.searchParams.get("code");
    } else if (parsed.data.code) {
      code = parsed.data.code;
    }

    if (!code) {
      return;
    }

    const existingAdmin = (
      await db
        .select()
        .from(admins)
        .where(eq(admins.workEmail, req.user.email))
        .limit(1)
    )[0];

    if (existingAdmin?.organizationId) {
      throw new BadRequestError(
        "User is already associated with an existing organization"
      );
    }

    const searchInvite = (
      await db
        .select()
        .from(organizationInvite)
        .where(eq(organizationInvite.code, parsed.data.code!))
        .limit(1)
    )[0];

    const now = new Date();

    if (
      searchInvite.allowedOrigins.findIndex(
        (mail) => mail === req.user.email
      ) === -1 &&
      searchInvite.inviteType != "open-for-all"
    ) {
      throw new BadRequestError("Invite restricted for org users only.");
    }

    if (searchInvite.status == "limit_reached") {
      throw new BadRequestError("Invite limit exhausted.");
    }

    if (
      !searchInvite ||
      searchInvite.status != "active" ||
      searchInvite.usageLimit === searchInvite.usageCount ||
      new Date(searchInvite.endDate) < now
    ) {
      throw new BadRequestError("Invalid invite code/link.");
    }

    const updatedAdmins = await db.transaction(async (tx) => {
      const now = new Date();
      const newUsageCount = searchInvite.usageCount + 1;
      const newStatus =
        newUsageCount === searchInvite.usageLimit
          ? "limit_reached"
          : searchInvite.status;

      const inviteUpdateResult = await tx
        .update(organizationInvite)
        .set({
          usageCount: newUsageCount,
          status: newStatus,
          updatedAt: now,
        })
        .where(eq(organizationInvite.id, searchInvite.id))
        .returning();

      let role: typeof roles.$inferSelect | null = null;

      if (searchInvite.roleId)
        [role] = await tx
          .select()
          .from(roles)
          .where(eq(roles.id, searchInvite.roleId));

      const adminUpdateResult = await tx
        .update(admins)
        .set({
          organizationId: searchInvite.organizationId,
          role: role?.tag,
          roleId: role?.id,
        })
        .where(
          and(eq(admins.id, req.user.id), eq(admins.workEmail, req.user.email))
        )
        .returning();

      if (adminUpdateResult.length === 0 || inviteUpdateResult.length === 0) {
        throw new InternalServerError("Failed to assign organization to admin");
      }

      return { adminUpdateResult, role };
    });

    const admin = updatedAdmins.adminUpdateResult[0];
    const role = updatedAdmins.role;

    const myToken = JwtService.sign({
      email: admin.workEmail,
      name: admin.name,
      id: admin.id,
      picture: admin.logoUrl,
      role: admin.role,
      roleId: admin.roleId,
      type: "admin",
      capabilities: role?.capabilities ?? [],
    });

    res.cookie("token", myToken, {
      httpOnly: true,
      secure: Env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res
      .status(200)
      .json({ message: "Joined organization successfully !" });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new InternalServerError();
  }
};
