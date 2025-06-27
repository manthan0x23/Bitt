import { Router } from "express";
import { authRouter } from "./auth";
import { organizationRouter } from "./organizations";
import { authenticateAdminMiddleware } from "../../middlewares/authenticate-admin";
import { jobRouter } from "./jobs";
import { stageRouter } from "./stages";
import { testcaseRouter } from "./testcases";
import { tasksRouter } from "./tasks";

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
adminRouter.use("/tasks", authenticateAdminMiddleware, tasksRouter);

export { adminRouter };
