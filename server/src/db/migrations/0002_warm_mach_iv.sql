ALTER TABLE "jobs" ALTER COLUMN "screening_type" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "jobs" ALTER COLUMN "screening_type" SET DEFAULT 'single-stage'::text;--> statement-breakpoint
DROP TYPE "public"."screening_type";--> statement-breakpoint
CREATE TYPE "public"."screening_type" AS ENUM('application', 'single-stage', 'multi-stage');--> statement-breakpoint
ALTER TABLE "jobs" ALTER COLUMN "screening_type" SET DEFAULT 'single-stage'::"public"."screening_type";--> statement-breakpoint
ALTER TABLE "jobs" ALTER COLUMN "screening_type" SET DATA TYPE "public"."screening_type" USING "screening_type"::"public"."screening_type";