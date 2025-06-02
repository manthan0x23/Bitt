import { Router } from "express";
import { asyncHandler } from "../../../../middlewares/handlers/async-handler";
import { updateOrganizationInvite } from "../../../../controllers/admin/organization-invites/update-invite";
import { createOrganizationInvite } from "../../../../controllers/admin/organization-invites/create-invite";
import { deleteOrganizationInvite } from "../../../../controllers/admin/organization-invites/delete-invite";
import { getAllOrganizationInvites } from "../../../../controllers/admin/organization-invites/get-all-invites";
import { getOrganizationInviteById } from "../../../../controllers/admin/organization-invites/get-invite-by-id";

const inviteRouter = Router();

inviteRouter
  .post("/create", asyncHandler(createOrganizationInvite))
  .put("/update/", asyncHandler(updateOrganizationInvite))
  .delete("/delete/:id", asyncHandler(deleteOrganizationInvite))
  .get("/all", asyncHandler(getAllOrganizationInvites))
  .get("/get/:id", asyncHandler(getOrganizationInviteById));

export { inviteRouter };
