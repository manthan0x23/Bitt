import type { Request, Response } from "express";
import { db } from "../../../db/db";
import { admins, organizations } from "../../../db/schema";
import { and, eq } from "drizzle-orm";
import { scrapeLogoUrl } from "../../../utils/integrations/logo-scrapper";
import { zCreateOrganizationBodyParser } from "./types/create-organization.input";

export const createOrganization = async (
  req: Request,
  res: Response
): Promise<any> => {
  const parsed = zCreateOrganizationBodyParser.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
  }

  if (!req.user || req.user.type !== "admin") {
    return res
      .status(401)
      .json({ error: "Unauthorized action to create organization" });
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
      return res.status(400).json({
        error: "User is already associated with an existing organization",
      });
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

      return { newOrg, updatedAdmins };
    });

    if (!result.updatedAdmins.length) {
      return res.status(500).json({
        error: "Failed to update admin with organization",
      });
    }

    return res.status(201).json({
      message: "Organization created successfully",
      organization: result.newOrg,
    });
  } catch (error) {
    console.error("Error creating organization:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
