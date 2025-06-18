import {
  pgTable,
  text,
  varchar,
  uuid,
  timestamp,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";
import { shortId } from "../../utils/integrations/short-id";
import { admins } from "./admins";
import { taskEntityEnum, taskStatusEnum, taskTypeEnum } from "./enums";
import { organizations } from "./organizations";

export const tasks = pgTable(
  "tasks",
  {
    id: varchar("id", { length: 256 })
      .notNull()
      .primaryKey()
      .$defaultFn(shortId),

    title: text("title").notNull(),
    message: text("message"),

    type: taskTypeEnum("type").notNull(),

    entityType: taskEntityEnum("entity_type").notNull(),

    entityId: uuid("entity_id"),

    assignedTo: varchar("assigned_to")
      .notNull()
      .references(() => admins.id),
    createdBy: varchar("created_by")
      .notNull()
      .references(() => admins.id),

    status: taskStatusEnum("status").notNull().default("pending"),

    organizationId: varchar("organization_id")
      .references(() => organizations.id)
      .notNull(),

    dueDate: timestamp("due_date", { mode: "string" }),

    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
  },
  (table) => ({
    assignedToIndex: index("task_assigned_to_idx").onOnly(table.assignedTo),
    createByIndex: index("created_by_idx").onOnly(table.createdBy),
    organizationTaskIndex: index("organization_task_id_idx").onOnly(
      table.organizationId
    ),
  })
);
