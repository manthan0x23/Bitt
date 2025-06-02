import { Router } from "express";
import { asyncHandler } from "../../../middlewares/handlers/async-handler";
import { createContest } from "../../../controllers/admin/contests/create-contest";
import { updateContest } from "../../../controllers/admin/contests/update-contest";
import { deleteContest } from "../../../controllers/admin/contests/delete-contest";

const contestRouter = Router();

contestRouter
  .post("/create", asyncHandler(createContest))
  .put("/update", asyncHandler(updateContest))
  .delete("/:id", asyncHandler(deleteContest));

export { contestRouter };
