import {
  boolean,
  foreignKey,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { accountSource } from "./account-source";
import { organizations } from "./organizations";

export const admins = pgTable("admins", {
  id: uuid("id").defaultRandom().unique().primaryKey().notNull(),

  name: varchar("name", { length: 256 }),

  workEmail: varchar("work_email").notNull().unique(),
  password: text("password"),
  emailVerified: boolean("email_verified").default(false),

  pictureurl: text("picture_url"),
  accountSource: accountSource("account_source")
    .default("credentials")
    .notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  isDeleted: timestamp("is_deleted"),
  updatedAt: timestamp("update_at").defaultNow().notNull(),

  organizationId: uuid("organization_id"),
});

foreignKey({
  name: "fk_admins_organization",
  columns: [admins.organizationId],
  foreignColumns: [organizations.id],
});
