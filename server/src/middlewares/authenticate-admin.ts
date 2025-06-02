import type { Request, Response, NextFunction } from "express";
import { JwtPayload, JwtService } from "../services/jwt";
import { UnauthorizedError } from "../utils/errors";

export const authenticateAdminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Authentication token missing" });
  }

  try {
    const decoded: JwtPayload = JwtService.verify(token);

    if (typeof decoded !== "object" || !decoded.id || !decoded.email) {
      throw new UnauthorizedError("Invalid token payload");
    }

    if (!decoded || decoded.type != "admin") {
      throw new UnauthorizedError("Forbidden");
    }

    req.user = decoded;
    next();
  } catch (error) {
    throw new UnauthorizedError("Invalid or expired token");
  }
};
