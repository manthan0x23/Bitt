import { pgEnum } from "drizzle-orm/pg-core";

export const stagePromotionTypeEnum = pgEnum("stage_promotion_type_enum", [
  "automatic",
  "manual",
]);
