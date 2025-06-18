import type { Request, Response, NextFunction } from "express";
import type { AdminRole } from "../utils/types/admin-roles";

export const allowedRoles =
  (allowedRoles: AdminRole[]): any =>
  (req: Request, res: Response, next: NextFunction) => {
    const role = req.user?.role;

    if (!role) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No role found on user" });
    }

    const isAllowed = allowedRoles.includes(role);

    if (!isAllowed) {
      return res.status(403).json({
        message: `Forbidden: Only [${allowedRoles.join(
          ", "
        )}] roles are allowed`,
      });
    }

    next();
  };
