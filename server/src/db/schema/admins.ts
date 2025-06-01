import {
  boolean,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { accountSourceEnum } from "./enums/account-source";
import { shortId } from "../../utils/integrations/short-id";

export const admins = pgTable("admins", {
  id: varchar("id")
    .primaryKey()
    .unique()
    .notNull()
    .$defaultFn(() => shortId(8)),
  name: varchar("name", { length: 256 }),

  workEmail: varchar("work_email").notNull().unique(),
  password: text("password"),
  emailVerified: boolean("email_verified").default(false),

  pictureurl: text("picture_url"),
  accountSource: accountSourceEnum("account_source")
    .default("credentials")
    .notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  isDeleted: timestamp("is_deleted"),
  updatedAt: timestamp("update_at").defaultNow().notNull(),

  organizationId: varchar("organization_id", { length: 256 }),
});
