import type { Request, Response, NextFunction } from "express";
import { JwtPayload, JwtService } from "../services/jwt";
import { db } from "../db/db";
import { users } from "../db/schema";
import { and, eq } from "drizzle-orm";
import { UnauthorizedError } from "../utils/errors";

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
      throw new UnauthorizedError("Invalid token payload");
    }

    req.user = decoded;
    next();
  } catch (error) {
    throw new UnauthorizedError("Invalid or expired token");
  }
};
