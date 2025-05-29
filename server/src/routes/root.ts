import { Router } from "express";
import { AuthRouter } from "./authentication/routes";
import { AdminRouter } from "./admin/routes";

const router: Router = Router();

router.use("/auth", AuthRouter);
router.use("/admin", AdminRouter);

export { router as ApiRouter };
