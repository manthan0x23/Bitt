import { Router } from "express";
import { asyncHandler } from "../../../../middlewares/handlers/async-handler";
import { requiresCapability } from "../../../../middlewares/authorize-admin";
import { capabilitiesMap } from "../../../../utils/types/admin-capabilities";

import { createOrganizationInvite } from "../../../../controllers/admin/organization-invites/create-invite";
import { updateOrganizationInvite } from "../../../../controllers/admin/organization-invites/update-invite";
import { deleteOrganizationInvite } from "../../../../controllers/admin/organization-invites/delete-invite";
import { getAllOrganizationInvites } from "../../../../controllers/admin/organization-invites/get-all-invites";
import { getOrganizationInviteById } from "../../../../controllers/admin/organization-invites/get-invite-by-id";

const inviteRouter = Router();

inviteRouter.post(
  "/create",
  requiresCapability(capabilitiesMap.invite.create),
  asyncHandler(createOrganizationInvite)
);

inviteRouter.put(
  "/update",
  requiresCapability(capabilitiesMap.invite.update),
  asyncHandler(updateOrganizationInvite)
);

inviteRouter.delete(
  "/delete/:id",
  requiresCapability(capabilitiesMap.invite.delete),
  asyncHandler(deleteOrganizationInvite)
);

inviteRouter.get(
  "/all",
  requiresCapability(capabilitiesMap.invite.read),
  asyncHandler(getAllOrganizationInvites)
);

inviteRouter.get(
  "/get/:id",
  requiresCapability(capabilitiesMap.invite.read),
  asyncHandler(getOrganizationInviteById)
);

export { inviteRouter };
