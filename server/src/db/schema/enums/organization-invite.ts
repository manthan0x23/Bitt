import { pgEnum } from "drizzle-orm/pg-core";

export const organizationInviteTypeEnum = pgEnum(
  "organization_invite_type_enum",
  ["open-for-all", "strict"]
);
