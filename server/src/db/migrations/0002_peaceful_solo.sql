ALTER TABLE "contests" DROP CONSTRAINT "contests_stage_id_unique";--> statement-breakpoint
ALTER TABLE "contests" ALTER COLUMN "contest_type" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "contests" ALTER COLUMN "contest_type" SET DEFAULT 'live'::text;--> statement-breakpoint
DROP TYPE "public"."contest_type";--> statement-breakpoint
CREATE TYPE "public"."contest_type" AS ENUM('live', 'assignment', 'practise');--> statement-breakpoint
ALTER TABLE "contests" ALTER COLUMN "contest_type" SET DEFAULT 'live'::"public"."contest_type";--> statement-breakpoint
ALTER TABLE "contests" ALTER COLUMN "contest_type" SET DATA TYPE "public"."contest_type" USING "contest_type"::"public"."contest_type";--> statement-breakpoint
ALTER TABLE "contests" ALTER COLUMN "stage_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "contests" ALTER COLUMN "end_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "contests" ADD COLUMN "instructions" text;--> statement-breakpoint
ALTER TABLE "contests" ADD COLUMN "is_independent" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "contests" ADD COLUMN "no_of_problems" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "contests" ADD COLUMN "warnings" json DEFAULT '[]'::json;--> statement-breakpoint
ALTER TABLE "contests" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;