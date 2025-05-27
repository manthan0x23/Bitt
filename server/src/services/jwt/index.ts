import jwt, { SignOptions } from "jsonwebtoken";
import { Env } from "../../utils/env";

export interface JwtPayload {
  id: string;
  email: string;
  name?: string | null;
  sub?: string;
  picture?: string | null;
  type: "user" | "admin";
}

export class JwtService {
  private static secret = Env.JWT_SECRET as string;

  static sign(
    payload: JwtPayload,
    expiresIn: number = 7 * 24 * 60 * 60
  ): string {
    const options: SignOptions = { expiresIn };
    return jwt.sign(payload, this.secret, options);
  }

  static verify<T = JwtPayload>(token: string): T {
    return jwt.verify(token, this.secret) as T;
  }

  static decode(token: string): JwtPayload | null {
    return jwt.decode(token) as JwtPayload | null;
  }
}
