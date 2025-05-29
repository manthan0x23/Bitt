import type { Request, Response, NextFunction } from "express";
import { JwtPayload, JwtService } from "../services/jwt";

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
      return res.status(401).json({ message: "Invalid token payload" });
    }

    if (!decoded || decoded.type != "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
