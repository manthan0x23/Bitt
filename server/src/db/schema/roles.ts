// db/schema/roles.ts
import {
  pgTable,
  uuid,
  varchar,
  boolean,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { capabilityEnum, colorSchemeEnum } from "./enums";
import { organizations } from "./organizations";
import { shortId } from "../../utils/integrations/short-id";

export const roles = pgTable(
  "roles",
  {
    id: varchar("id")
      .primaryKey()
      .$defaultFn(() => shortId(8)),

    tag: varchar("tag", { length: 64 }).notNull(),
    capabilities: capabilityEnum().array().notNull().default([]),

    organizationId: varchar("organization_id")
      .references(() => organizations.id, { onDelete: "cascade" })
      .notNull(),

    colorScheme: colorSchemeEnum().default("gray").notNull(),

    isTemplate: boolean("is_template").default(false).notNull(),
  },
  (table) => ({
    orgIdTagIdx: uniqueIndex("org_id_tag_idx").on(
      table.organizationId,
      table.tag
    ),
  })
);
