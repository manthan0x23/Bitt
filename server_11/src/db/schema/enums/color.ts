import { pgEnum } from "drizzle-orm/pg-core";

export const colorSchemeEnum = pgEnum("color_scheme", [
  "gray",     // default / neutral
  "blue",     // info / primary
  "green",    // success
  "red",      // danger / error
  "pink",     // playful / accent
  "orange",   // warning
  "yellow",   // caution
  "purple",   // creativity / secondary
  "teal",     // alternative success
  "indigo",   // highlight
]);
