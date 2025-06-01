import {
  index,
  pgTable,
  timestamp,
  varchar,
  integer,
} from "drizzle-orm/pg-core";
import { shortId } from "../../utils/integrations/short-id";
import { organizations } from "./organizations";
import { organizationInviteTypeEnum } from "./enums";
import { admins } from "./admins";

export const organizationInvite = pgTable(
  "organization_invite",
  {
    id: varchar("id", { length: 256 })
      .primaryKey()
      .notNull()
      .$defaultFn(shortId),

    code: varchar("code", { length: 64 })
      .notNull()
      .unique()
      .$defaultFn(() => shortId(8)),

    organizationId: varchar("organization_id", { length: 256 })
      .references(() => organizations.id, { onDelete: "cascade" })
      .notNull(),

    allowedOrigins: varchar("allowed_origins", { length: 512 })
      .array()
      .default([]),

    inviteType: organizationInviteTypeEnum("invite_type")
      .default("strict")
      .notNull(),

    usageLimit: integer("usage_limit").default(1).notNull(),
    usageCount: integer("usage_count").default(0).notNull(),

    createdBy: varchar("created_by", { length: 256 })
      .references(() => admins.id, { onDelete: "set null" })
      .notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => ({
    organizationIdIdx: index("organization_invite_organizationId_idx").on(
      table.organizationId
    ),
    codeIdx: index("organization_invite_code_idx").on(table.code),
    createdByIdx: index("organization_invite_createdBy_idx").on(
      table.createdBy
    ),
  })
);
