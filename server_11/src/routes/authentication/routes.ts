import { Router } from "express";
import {
  redirectToGoogleAuthScreen,
  loginWithGoogleOAuth,
} from "../../controllers/authentication/google-auth";
import { verifyAuthenticationUsingCookieToken } from "../../controllers/authentication/verify-auth";

const authRouter = Router();

authRouter
  .get("/google/callback", loginWithGoogleOAuth)
  .get("/google", redirectToGoogleAuthScreen)
  .get("/verify", verifyAuthenticationUsingCookieToken);

export { authRouter };
