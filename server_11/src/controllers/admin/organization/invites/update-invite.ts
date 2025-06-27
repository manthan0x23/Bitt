import type { Request, Response } from "express";
import { db } from "../../../../db/db";
import { organizationInvite } from "../../../../db/schema";
import { eq } from "drizzle-orm";
import {
  BadRequestError,
  UnauthorizedError,
  InternalServerError,
} from "../../../../utils/errors";
import { zUpdateOrganizationInviteInput } from "./types/update-invite.input";

export const updateOrganizationInvite = async (
  req: Request,
  res: Response
): Promise<any> => {
  const parsed = zUpdateOrganizationInviteInput.safeParse(req.body);
  if (!parsed.success) {
    throw new BadRequestError(JSON.stringify(parsed.error.message));
  }

  if (!req.user || req.user.type !== "admin") {
    throw new UnauthorizedError("Unauthorized to update invite");
  }

  try {
    const { id, ...rest } = parsed.data;

    const updateData: any = {
      ...rest,
      updatedAt: new Date(),
    };

    const [updated] = await db
      .update(organizationInvite)
      .set(updateData)
      .where(eq(organizationInvite.id, id))
      .returning();

    return res.status(200).json({
      message: "Invite updated successfully",
      data: updated,
    });
  } catch (error) {
    throw new InternalServerError();
  }
};
