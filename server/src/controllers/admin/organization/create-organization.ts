import type { Request, Response } from "express";
import { db } from "../../../db/db";
import { admins, organizations } from "../../../db/schema";
import { and, eq } from "drizzle-orm";
import { scrapeLogoUrl } from "../../../utils/integrations/logo-scrapper";
import { zCreateOrganizationInput } from "./types/create-organization.input";
import {
  AppError,
  BadRequestError,
  InternalServerError,
  UnauthorizedError,
} from "../../../utils/errors";

export const createOrganization = async (
  req: Request,
  res: Response
): Promise<any> => {
  const parsed = zCreateOrganizationInput.safeParse(req.body);
  if (!parsed.success) {
    throw new BadRequestError(JSON.stringify(parsed.error.errors.flat()));
  }

  if (!req.user || req.user.type !== "admin") {
    throw new UnauthorizedError("Unauthorized action to create organization");
  }

  try {
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

    const logoUrl = await scrapeLogoUrl(parsed.data.url);
    const user = req.user;

    const result = await db.transaction(async (tx) => {
      const newOrg = (
        await tx
          .insert(organizations)
          .values({
            name: parsed.data.name,
            slug: parsed.data.url,
            billingEmailAddress: parsed.data.billingEmailAddress,
            description: parsed.data.description,
            origin: parsed.data.origin,
            createdBy: user.id,
            logoUrl,
            startDate: parsed.data.startDate,
          })
          .returning()
      )[0];

      const updatedAdmins = await tx
        .update(admins)
        .set({ organizationId: newOrg.id })
        .where(and(eq(admins.id, user.id), eq(admins.workEmail, user.email)))
        .returning();

      if (!result.updatedAdmins.length) {
        throw new InternalServerError(
          "Failed to update admin with organization"
        );
      }

      return { newOrg, updatedAdmins };
    });

    return res.status(201).json({
      message: "Organization created successfully",
      organization: result.newOrg,
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new InternalServerError();
  }
};
