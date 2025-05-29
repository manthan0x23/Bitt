import { Router } from "express";
import {
  redirectToGoogleAuthScreen,
  loginWithGoogleOAuth,
} from "../../controllers/authentication/google-auth";
import { verifyAuthenticationUsingCookieToken } from "../../controllers/authentication/verify-auth";

const router = Router();

router
  .get("/google/callback", loginWithGoogleOAuth)
  .get("/google", redirectToGoogleAuthScreen)
  .get("/verify", verifyAuthenticationUsingCookieToken);

export { router as AuthRouter };
