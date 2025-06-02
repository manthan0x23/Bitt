import { Router } from "express";
import { authRouter } from "./auth/routes";
import { organizationRouter } from "./organizations/routes";
import { authenticateAdminMiddleware } from "../../middlewares/authenticate-admin";

const adminRouter = Router();

adminRouter.use("/auth", authRouter);
adminRouter.use(
  "/organization",
  authenticateAdminMiddleware,
  organizationRouter
);

export { adminRouter };
