CREATE TYPE "public"."stage_promotion_type_enum" AS ENUM('automatic', 'manual');--> statement-breakpoint
CREATE TABLE "job_registrations" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"job_id" varchar(256) NOT NULL,
	"user_id" varchar(256) NOT NULL,
	"promotionType" "stage_promotion_type_enum" DEFAULT 'automatic' NOT NULL,
	"cover_letter" text NOT NULL,
	"stage_index" integer DEFAULT 1 NOT NULL,
	"registered_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "quiz_problem_submission" (
	"id" varchar(256) PRIMARY KEY NOT NULL
);
--> statement-breakpoint
ALTER TABLE "submissions" RENAME COLUMN "author_id" TO "contest_registeration_id";--> statement-breakpoint
ALTER TABLE "submissions" RENAME COLUMN "code" TO "code_key";--> statement-breakpoint
ALTER TABLE "submissions" DROP CONSTRAINT "submissions_code_unique";--> statement-breakpoint
ALTER TABLE "contest_registrations" DROP CONSTRAINT "contest_registrations_registered_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "submissions" DROP CONSTRAINT "submissions_author_id_contest_registrations_id_fk";
--> statement-breakpoint
DROP INDEX "contest_registrations_unique_contest_user_registration";--> statement-breakpoint
DROP INDEX "idx_submissions_problem";--> statement-breakpoint
DROP INDEX "idx_submissions_contest";--> statement-breakpoint
DROP INDEX "idx_submissions_author";--> statement-breakpoint
ALTER TABLE "contest_registrations" ADD COLUMN "job_registration_id" varchar(256);--> statement-breakpoint
ALTER TABLE "job_registrations" ADD CONSTRAINT "job_registrations_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_registrations" ADD CONSTRAINT "job_registrations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "job_user_stage_composite_key_idx" ON "job_registrations" USING btree ("job_id","user_id");--> statement-breakpoint
CREATE INDEX "job_stage_registered_idx" ON "job_registrations" USING btree ("job_id","stage_index");--> statement-breakpoint
ALTER TABLE "contest_registrations" ADD CONSTRAINT "contest_registrations_job_registration_id_job_registrations_id_fk" FOREIGN KEY ("job_registration_id") REFERENCES "public"."job_registrations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_contest_registeration_id_contest_registrations_id_fk" FOREIGN KEY ("contest_registeration_id") REFERENCES "public"."contest_registrations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_submissions_author" ON "submissions" USING btree ("contest_registeration_id");--> statement-breakpoint
ALTER TABLE "contest_registrations" DROP COLUMN "registered_user_id";