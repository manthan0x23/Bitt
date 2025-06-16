import { Router } from "express";
import { authRouter } from "./auth/routes";
import { organizationRouter } from "./organizations/routes";
import { authenticateAdminMiddleware } from "../../middlewares/authenticate-admin";
import { jobRouter } from "./jobs/routes";
import { stageRouter } from "./stages/routes";
import { testcaseRouter } from "./testcases/routes";

const adminRouter = Router();

adminRouter.use("/auth", authRouter);

adminRouter.use(
  "/organization",
  authenticateAdminMiddleware,
  organizationRouter
);

adminRouter.use("/job", authenticateAdminMiddleware, jobRouter);
adminRouter.use("/stages", authenticateAdminMiddleware, stageRouter);
adminRouter.use("/testcases", authenticateAdminMiddleware, testcaseRouter);

export { adminRouter };
