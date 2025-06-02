import { Router } from "express";
import { authRouter } from "./authentication/routes";
import { adminRouter } from "./admin";

const router: Router = Router();

router.use("/auth", authRouter);
router.use("/admin", adminRouter);

export { router as ApiRouter };
