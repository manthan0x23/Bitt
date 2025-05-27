import { Router } from "express";
import {
  loginWithGoogle,
  redirectGoogleAuthScreen,
} from "../../controllers/authentication/google-auth";

const router = Router();

router
  .get("/google", redirectGoogleAuthScreen)
  .get("/google/callback", loginWithGoogle);

export { router as AuthRouter };
