import type { Request, Response, NextFunction } from "express";
import { JwtPayload, JwtService } from "../services/jwt";
import { db } from "../db/db";
import { users } from "../db/schema";
import { and, eq } from "drizzle-orm";

export const authenticateUserMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Authentication token missing" });
  }

  try {
    const decoded = JwtService.verify(token);

    if (typeof decoded !== "object" || !decoded.id || !decoded.email) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    const checkUser = (
      await db
        .selectDistinct()
        .from(users)
        .where(and(eq(users.id, decoded.id), eq(users.email, decoded.email)))
        .limit(1)
    )[0];

    if (!checkUser) {
      return res.status(403).json({ message: "Forbidden" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
