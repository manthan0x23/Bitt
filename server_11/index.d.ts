import { JwtPayload } from "./src/services/jwt/index";
declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
      files?: Record<string, any>;
    }
  }
}
