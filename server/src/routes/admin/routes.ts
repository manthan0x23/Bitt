import { Router } from "express";
import {
  loginAdminWithGoogle,
  redirectAdminGoogleAuthScreen,
} from "../../controllers/admin/auth/google-auth";

const adminRouter = Router();

// auth
adminRouter
  .get("/admin-google", redirectAdminGoogleAuthScreen)
  .get("/admin-google/callback", loginAdminWithGoogle);

// organization

export { adminRouter };
