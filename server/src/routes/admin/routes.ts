import { Router } from "express";
import {
  loginAdminWithGoogle,
  redirectAdminGoogleAuthScreen,
} from "../../controllers/admin/auth/google-auth";
import { authenticateAdminMiddleware } from "../../middlewares/authenticate-admin";
import { createOrganization } from "../../controllers/admin/organization/create-organization";

const adminRouter = Router();

// auth
adminRouter
  .get("/auth/google/callback", loginAdminWithGoogle)
  .get("/auth/google", redirectAdminGoogleAuthScreen);

// organization
adminRouter.post(
  "/create-organization",
  authenticateAdminMiddleware,
  createOrganization
);

export { adminRouter };
