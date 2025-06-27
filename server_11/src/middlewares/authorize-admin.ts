import type { Request, Response, NextFunction } from "express";
import { db } from "../db/db";
import { roles } from "../db/schema/roles";
import { eq } from "drizzle-orm";
import { UnauthorizedError, ForbiddenError } from "../utils/errors";
import { Capability } from "../utils/types/admin-capabilities";

/**
 * Middleware to enforce role-based capability permissions
 *
 * @param requiredCapability - The capability string to check (e.g. "create.job")
 */
export const requiresCapability =
  (requiredCapability: Capability) =>
  async (req: Request, _: Response, next: NextFunction) => {
    const user = req.user;

    if (!user || user.type !== "admin" || !user.roleId) {
      return next(
        new UnauthorizedError("Unauthorized: Invalid admin credentials")
      );
    }

    try {
      const [role] = await db
        .select({ capabilities: roles.capabilities })
        .from(roles)
        .where(eq(roles.id, user.roleId))
        .limit(1);

      if (!role) {
        return next(new ForbiddenError("Forbidden: Role not found"));
      }

      if (!role.capabilities.includes(requiredCapability)) {
        return next(
          new ForbiddenError(
            `Forbidden: Missing required capability "${requiredCapability}"`
          )
        );
      }

      return next();
    } catch (err) {
      console.error("Error in requireCapability middleware:", err);
      return next(new UnauthorizedError("Error validating capability"));
    }
  };
