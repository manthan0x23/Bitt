CREATE TYPE "public"."stage_select_type" AS ENUM('strict', 'relax');--> statement-breakpoint
CREATE TYPE "public"."stage_flow_criteria" AS ENUM('automatic', 'manual');--> statement-breakpoint
CREATE TYPE "public"."stage_status_enum" AS ENUM('upcomming', 'ongoing', 'completed');--> statement-breakpoint
CREATE TYPE "public"."stage_type_enum" AS ENUM('contest', 'mcq_test', 'resume_filter', 'interview');--> statement-breakpoint
CREATE TABLE "stages" (
	"id" varchar(256) NOT NULL,
	"stage_index" integer DEFAULT 1 NOT NULL,
	"type" "stage_type_enum" DEFAULT 'contest' NOT NULL,
	"inflow" integer DEFAULT 2000 NOT NULL,
	"outflow" integer DEFAULT 100 NOT NULL,
	"selectionCriteria" "stage_flow_criteria" DEFAULT 'automatic' NOT NULL,
	"selectType" "stage_select_type" DEFAULT 'relax' NOT NULL,
	"is_final" boolean DEFAULT false,
	"start_at" timestamp with time zone NOT NULL,
	"end_at" timestamp with time zone NOT NULL,
	"job_id" varchar(256) NOT NULL,
	CONSTRAINT "stages_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "contests" DROP CONSTRAINT "contests_stage_job_id_idx";--> statement-breakpoint
ALTER TABLE "contests" DROP CONSTRAINT "contests_job_id_jobs_id_fk";
--> statement-breakpoint
DROP INDEX "contests_job_idx";--> statement-breakpoint
ALTER TABLE "contests" ADD COLUMN "stage_id" varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE "stages" ADD CONSTRAINT "stages_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "stage_job_id_index" ON "stages" USING btree ("job_id","stage_index");--> statement-breakpoint
ALTER TABLE "contests" ADD CONSTRAINT "contests_stage_id_jobs_id_fk" FOREIGN KEY ("stage_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contests" DROP COLUMN "stage";--> statement-breakpoint
ALTER TABLE "contests" DROP COLUMN "job_id";--> statement-breakpoint
ALTER TABLE "contests" ADD CONSTRAINT "contests_stage_id_unique" UNIQUE("stage_id");