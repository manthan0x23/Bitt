import type { Request, Response } from "express";
import { db } from "../../../db/db";
import { organizationInvite } from "../../../db/schema";
import { eq } from "drizzle-orm";
import {
  BadRequestError,
  UnauthorizedError,
  InternalServerError,
} from "../../../utils/errors";

export const deleteOrganizationInvite = async (
  req: Request,
  res: Response
): Promise<any> => {
  const inviteId = req.params.id;

  if (!inviteId) {
    throw new BadRequestError("Missing invite ID");
  }

  if (!req.user || req.user.type !== "admin") {
    throw new UnauthorizedError("Unauthorized to delete invite");
  }

  try {
    await db
      .update(organizationInvite)
      .set({
        status: "deleted",
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(organizationInvite.id, inviteId));

    return res.status(200).json({
      message: "Invite deleted (soft) successfully",
    });
  } catch (error) {
    throw new InternalServerError();
  }
};
