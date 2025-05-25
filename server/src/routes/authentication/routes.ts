import { Router } from "express";
import {
  LoginWithGoogle,
  RedirectGoogleAuthScreen,
} from "../../controllers/authentication/login-google";

const router = Router();

router
  .get("/google", RedirectGoogleAuthScreen)
  .get("/google/callback", LoginWithGoogle);

export { router as AuthRouter };
