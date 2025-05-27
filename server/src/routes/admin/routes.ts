import { Router } from "express";

const adminRouter = Router();

// auth
adminRouter.get("/admin-google");

export { adminRouter };
