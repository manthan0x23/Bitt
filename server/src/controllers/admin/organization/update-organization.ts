import { Request, Response } from "express";
import { zUpdateOrganizationInput } from "./types/update-organization.input";
import {
  AppError,
  BadRequestError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from "../../../utils/errors";
import { db } from "../../../db/db";
import { admins, organizations } from "../../../db/schema";
import { and, eq } from "drizzle-orm";

export const updateOrganization = async (req: Request, res: Response) => {
  const parsed = zUpdateOrganizationInput.safeParse(req.body);

  if (parsed.error) {
    throw new BadRequestError(
      JSON.stringify(parsed.error.flatten().fieldErrors)
    );
  }
  if (!req.user || req.user.type !== "admin") {
    throw new UnauthorizedError("Unauthorized action to create organization");
  }

  try {
    const adminState = (
      await db
        .select({
          organizationId: admins.organizationId,
        })
        .from(admins)
        .where(
          and(eq(admins.id, req.user.id), eq(admins.workEmail, req.user.email))
        )
        .limit(1)
    )[0];

    if (!adminState.organizationId) {
      throw new NotFoundError("Admin not linked with any organization.");
    }

    const prevOrganizationState = (
      await db
        .select()
        .from(organizations)
        .where(eq(organizations.id, adminState.organizationId))
        .limit(1)
    )[0];

    const newOrganizationState = (
      await db
        .update(organizations)
        .set({
          name: parsed.data.name ?? prevOrganizationState.name,
          description:
            parsed.data.description ?? prevOrganizationState.description,
          billingEmailAddress:
            parsed.data.billingEmailAddress ??
            prevOrganizationState.billingEmailAddress,
          billingEmailVerified: parsed.data.billingEmailAddress
            ? false
            : prevOrganizationState.billingEmailVerified,

          updatedAt: new Date(),
          // logoUrl:
        })
        .where(eq(organizations.id, prevOrganizationState.id))
        .returning()
    )[0];

    return res.status(200).json({
      message: "Organization metadata updated successfully !",
      data: newOrganizationState,
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new InternalServerError();
  }
};
