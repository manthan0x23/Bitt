import { Router } from "express";
import { authRouter } from "./auth/routes";
import { organizationRouter } from "./organizations/routes";
import { authenticateAdminMiddleware } from "../../middlewares/authenticate-admin";
import { jobRouter } from "./jobs/routes";
import { contestRouter } from "./contests/routes";

const adminRouter = Router();

adminRouter.use("/auth", authRouter);

adminRouter.use(
  "/organization",
  authenticateAdminMiddleware,
  organizationRouter
);

adminRouter.use("/job", authenticateAdminMiddleware, jobRouter);

adminRouter.use("/contest", authenticateAdminMiddleware, contestRouter);

export { adminRouter };
