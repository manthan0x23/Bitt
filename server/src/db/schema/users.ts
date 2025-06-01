import {
  boolean,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { accountSourceEnum } from "./enums/account-source";
import { nanoid } from "nanoid";

export const users = pgTable("users", {
  id: varchar("id")
    .unique()
    .primaryKey()
    .notNull()
    .$defaultFn(() => nanoid(8)),

  name: varchar("name", { length: 256 }),
  email: varchar("email", { length: 256 }).notNull().unique(),
  password: text("password"),
  pictureurl: text("picture_url"),
  emailVerified: boolean("email_verified").default(false).notNull(),
  accountSource: accountSourceEnum("account_source")
    .default("credentials")
    .notNull(),

  resume: varchar("resume", { length: 256 }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  isDeleted: timestamp("is_deleted"),
  updatedAt: timestamp("update_at").defaultNow().notNull(),
});
