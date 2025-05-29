import { Router } from "express";
import {
  loginAdminWithGoogle,
  redirectAdminGoogleAuthScreen,
} from "../../controllers/admin/auth/google-auth";

const AdminRouter = Router();

// auth
AdminRouter.get("/auth/google/callback", loginAdminWithGoogle).get(
  "/auth/google",
  redirectAdminGoogleAuthScreen
);

// organization

export { AdminRouter };
