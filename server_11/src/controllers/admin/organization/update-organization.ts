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
import { StorageService } from "../../../services/aws/storage";

export const updateOrganization = async (req: Request, res: Response) => {
  const parsed = zUpdateOrganizationInput.safeParse({
    ...req.body,
    logo: req.file,
  });

  if (parsed.error) {
    throw new BadRequestError(JSON.stringify(parsed.error.message));
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

    let logoUrl = prevOrganizationState.logoUrl;

    if (parsed.data.logo) {
      const storageService = new StorageService();

      const logoKey = await storageService.uploadObject(
        `bit/logo/organization/${prevOrganizationState.id}.${
          String(parsed.data.logo.originalname).split(".")[1]
        }`,
        parsed.data.logo.buffer
      );

      logoUrl = StorageService.getUrlFromKey(logoKey);
    }

    const newOrganizationState = (
      await db
        .update(organizations)
        .set({
          name: parsed.data.name ?? prevOrganizationState.name,
          description:
            parsed.data.description ?? prevOrganizationState.description,
          updatedAt: new Date(),
          slug: parsed.data.slug ?? prevOrganizationState.slug,
          origin: parsed.data.origin ?? prevOrganizationState.origin,
          startDate: parsed.data.startDate
            ? (parsed.data.startDate instanceof Date
                ? parsed.data.startDate.toISOString()
                : parsed.data.startDate)
            : prevOrganizationState.startDate,
          logoUrl,
        })
        .where(eq(organizations.id, prevOrganizationState.id))
        .returning()
    )[0];

    return res.status(200).json({
      message: "Organization metadata updated successfully !",
      data: newOrganizationState,
    });
  } catch (error) {
    console.error(error);

    if (error instanceof AppError) {
      throw error;
    }
    throw new InternalServerError();
  }
};
