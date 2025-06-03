import { Router } from "express";
import {
  loginAdminWithGoogle,
  redirectAdminGoogleAuthScreen,
} from "../../../controllers/admin/auth/google-auth";

const authRouter = Router();

authRouter
  .get("/google/callback", loginAdminWithGoogle)
  .get("/google", redirectAdminGoogleAuthScreen);

export { authRouter };
