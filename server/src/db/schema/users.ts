import {
  boolean,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { accountSource } from "./account-source";

export const users = pgTable("users", {
  id: uuid("id").unique().primaryKey().notNull().defaultRandom(),
  name: varchar("name", { length: 256 }),
  email: varchar("email", { length: 256 }).notNull().unique(),
  password: text("password"),
  pictureurl: text("picture_url"),
  emailVerified: boolean("email_verified").default(false).notNull(),
  accountSource: accountSource("account_source")
    .default("credentials")
    .notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  isDeleted: timestamp("is_deleted"),
  updatedAt: timestamp("update_at").defaultNow().notNull(),
});
