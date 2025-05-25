import { Router } from "express";
import { AuthRouter } from "./authentication/routes";

const router: Router = Router();

router.use("/auth", AuthRouter);

export { router as ApiRouter };
