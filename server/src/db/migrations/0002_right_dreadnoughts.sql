ALTER TYPE "public"."capability" ADD VALUE 'manage.roles';--> statement-breakpoint
ALTER TABLE "roles" RENAME COLUMN "colorScheme" TO "color_scheme";