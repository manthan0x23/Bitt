import { Router } from "express";
import { authRouter } from "./authentication/routes";
import { adminRouter } from "./admin";
import { submissionRouter } from "./submissions/routes";

const router: Router = Router();

router.use("/auth", authRouter);
router.use("/admin", adminRouter);
router.use("/submission", submissionRouter);

export { router as ApiRouter };
