import { Request, Response } from "express";
import { zJoinOrganizationInput } from "./types/join-organization.input";
import { db } from "../../../db/db";
import { admins, organizationInvite } from "../../../db/schema";
import { and, eq } from "drizzle-orm";
import {
  AppError,
  BadRequestError,
  InternalServerError,
  UnauthorizedError,
} from "../../../utils/errors";

export const joinOrganization = async (
  req: Request,
  res: Response
): Promise<any> => {
  const parsed = zJoinOrganizationInput.safeParse(req.body);

  if (parsed.error) {
    throw new BadRequestError(JSON.stringify(parsed.error.errors.flat()));
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
      !searchInvite ||
      searchInvite.status === "expired" ||
      searchInvite.status === "closed" ||
      searchInvite.usageLimit === searchInvite.usageCount ||
      new Date(searchInvite.endDate) < now ||
      searchInvite.allowedOrigins.findIndex(
        (mail) => mail === req.user.email
      ) === -1
    ) {
      throw new BadRequestError("Invalid invite code/link");
    }

    await db.transaction(async (tx) => {
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

      const adminUpdateResult = await tx
        .update(admins)
        .set({
          organizationId: searchInvite.organizationId,
        })
        .where(
          and(eq(admins.id, req.user.id), eq(admins.workEmail, req.user.email))
        )
        .returning();

      if (adminUpdateResult.length === 0 || inviteUpdateResult.length === 0) {
        throw new InternalServerError("Failed to assign organization to admin");
      }
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
