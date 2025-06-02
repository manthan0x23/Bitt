import { pgEnum } from "drizzle-orm/pg-core";

export const organizationInviteTypeEnum = pgEnum(
  "organization_invite_type_enum",
  ["open-for-all", "strict"]
);

export const organizationInviteStatusEnum = pgEnum(
  "organization_invite_status_enum",
  ["active", "closed", "expired", "limit_reached"]
);
