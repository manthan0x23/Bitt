CREATE TYPE "public"."account_source" AS ENUM('google', 'credentials');--> statement-breakpoint
CREATE TYPE "public"."contest_access" AS ENUM('public', 'private', 'invite-only');--> statement-breakpoint
CREATE TYPE "public"."contest_publish_state_enum" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."contest_type" AS ENUM('live', 'take-home', 'practise', 'upsolve');--> statement-breakpoint
CREATE TYPE "public"."job_status" AS ENUM('draft', 'open', 'closed', 'archived');--> statement-breakpoint
CREATE TYPE "public"."job_type" AS ENUM('internship', 'full-time', 'part-time');--> statement-breakpoint
CREATE TYPE "public"."screening_type" AS ENUM('manual', 'auto-cutoff', 'multi-stage');--> statement-breakpoint
CREATE TYPE "public"."problem_state" AS ENUM('draft', 'live');--> statement-breakpoint
CREATE TYPE "public"."code_language_enum" AS ENUM('cpp20', 'python3', 'java', 'javascript');--> statement-breakpoint
CREATE TYPE "public"."submission_status_enum" AS ENUM('PD', 'QU', 'RN', 'AC', 'WA', 'TLE', 'MLE', 'RE', 'CE', 'OLE', 'PE', 'IE', 'SE', 'RJ');--> statement-breakpoint
CREATE TYPE "public"."code_verdict_enum" AS ENUM('Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Memory Limit Exceeded', 'Runtime Error', 'Compilation Error', 'Output Limit Exceeded', 'Presentation Error', 'Internal Error', 'System Error', 'Rejected', 'Pending', 'In Queue', 'Running', 'Plagiarized', 'Skipped');--> statement-breakpoint
CREATE TYPE "public"."contest_invite_status_enum" AS ENUM('accepted', 'rejected', 'idle', 'expired');--> statement-breakpoint
CREATE TYPE "public"."organization_invite_status_enum" AS ENUM('active', 'closed', 'expired', 'limit_reached', 'deleted');--> statement-breakpoint
CREATE TYPE "public"."organization_invite_type_enum" AS ENUM('open-for-all', 'strict');--> statement-breakpoint
CREATE TABLE "admins" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"work_email" varchar NOT NULL,
	"password" text,
	"email_verified" boolean DEFAULT false,
	"picture_url" text,
	"account_source" "account_source" DEFAULT 'credentials' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"is_deleted" timestamp,
	"update_at" timestamp DEFAULT now() NOT NULL,
	"organization_id" varchar(256),
	CONSTRAINT "admins_id_unique" UNIQUE("id"),
	CONSTRAINT "admins_work_email_unique" UNIQUE("work_email")
);
--> statement-breakpoint
CREATE TABLE "contest_invite" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"user_id" varchar(256),
	"contest_id" varchar(256),
	"contest_invite_status" "contest_invite_status_enum" DEFAULT 'idle' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"expiration_time" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contest_registrations" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"contest_id" varchar(256) NOT NULL,
	"registered_user_id" varchar(256) NOT NULL,
	"registered_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "contests" (
	"contests" varchar(256) PRIMARY KEY NOT NULL,
	"title" varchar(256),
	"descriptions" text,
	"stage" integer DEFAULT 1 NOT NULL,
	"job_id" varchar(256) NOT NULL,
	"start_at" timestamp NOT NULL,
	"end_at" timestamp NOT NULL,
	"duration" integer DEFAULT 90 NOT NULL,
	"contest_type" "contest_type" DEFAULT 'live' NOT NULL,
	"accessibility" "contest_access" DEFAULT 'public' NOT NULL,
	"available_for_practise" boolean DEFAULT true NOT NULL,
	"publish_state" "contest_publish_state_enum" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "contests_stage_job_id_idx" UNIQUE("stage","job_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"email" varchar(256) NOT NULL,
	"password" text,
	"picture_url" text,
	"email_verified" boolean DEFAULT false NOT NULL,
	"account_source" "account_source" DEFAULT 'credentials' NOT NULL,
	"resume" varchar(256),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"is_deleted" timestamp,
	"update_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_id_unique" UNIQUE("id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"logo_url" text,
	"billing_email_address" text NOT NULL,
	"billing_email_verified" boolean DEFAULT false NOT NULL,
	"origin" text NOT NULL,
	"start_date" date,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" varchar(256) NOT NULL,
	CONSTRAINT "organizations_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "jobs" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"slug" varchar(256) NOT NULL,
	"description" text NOT NULL,
	"location" varchar(128) NOT NULL,
	"type" "job_type" NOT NULL,
	"status" "job_status" DEFAULT 'draft' NOT NULL,
	"screening_type" "screening_type" DEFAULT 'manual' NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"organization_id" varchar(256) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "problems" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"description" text NOT NULL,
	"input_description" text NOT NULL,
	"output_description" text NOT NULL,
	"constraints" text NOT NULL,
	"hint" text,
	"sample_input" text,
	"sample_output" text,
	"points" integer DEFAULT 100 NOT NULL,
	"difficulty" integer DEFAULT 1 NOT NULL,
	"time_limit_ms" integer DEFAULT 1000 NOT NULL,
	"memory_limit_mb" integer DEFAULT 256 NOT NULL,
	"author_id" varchar,
	"contest_id" varchar,
	"tags" varchar(256),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "testcases" (
	"id" varchar PRIMARY KEY NOT NULL,
	"slug" varchar(256) NOT NULL,
	"problem_id" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "submissions" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"author_id" varchar(256) NOT NULL,
	"problem_id" varchar(256) NOT NULL,
	"contest_id" varchar(256),
	"code" varchar(256) NOT NULL,
	"language" "code_language_enum" NOT NULL,
	"submission_status" "submission_status_enum" DEFAULT 'QU' NOT NULL,
	"verdict" "code_verdict_enum",
	"score" integer DEFAULT 0,
	"execution_time_ms" integer,
	"memory_used_kb" integer,
	"submitted_at" timestamp DEFAULT now() NOT NULL,
	"judged_at" timestamp,
	"created_by_ip" varchar(256),
	"is_plagiarized" boolean DEFAULT false NOT NULL,
	"plagiarism_score" integer,
	"plagiarism_reference_id" varchar(256),
	CONSTRAINT "submissions_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "organization_invite" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"code" varchar(64) NOT NULL,
	"organization_id" varchar(256) NOT NULL,
	"allowed_origins" varchar(512)[] DEFAULT '{}' NOT NULL,
	"invite_type" "organization_invite_type_enum" DEFAULT 'strict' NOT NULL,
	"usage_limit" integer DEFAULT 1 NOT NULL,
	"usage_count" integer DEFAULT 0 NOT NULL,
	"created_by" varchar(256) NOT NULL,
	"status" "organization_invite_status_enum" DEFAULT 'active' NOT NULL,
	"end_date" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"update_at" timestamp,
	CONSTRAINT "organization_invite_code_unique" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "contest_invite" ADD CONSTRAINT "contest_invite_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contest_invite" ADD CONSTRAINT "contest_invite_contest_id_contests_contests_fk" FOREIGN KEY ("contest_id") REFERENCES "public"."contests"("contests") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contest_registrations" ADD CONSTRAINT "contest_registrations_contest_id_contests_contests_fk" FOREIGN KEY ("contest_id") REFERENCES "public"."contests"("contests") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contest_registrations" ADD CONSTRAINT "contest_registrations_registered_user_id_users_id_fk" FOREIGN KEY ("registered_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contests" ADD CONSTRAINT "contests_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "problems" ADD CONSTRAINT "problems_author_id_admins_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."admins"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "problems" ADD CONSTRAINT "problems_contest_id_contests_contests_fk" FOREIGN KEY ("contest_id") REFERENCES "public"."contests"("contests") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "testcases" ADD CONSTRAINT "testcases_problem_id_problems_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."problems"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_author_id_contest_registrations_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."contest_registrations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_problem_id_problems_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."problems"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_invite" ADD CONSTRAINT "organization_invite_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_invite" ADD CONSTRAINT "organization_invite_created_by_admins_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."admins"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "contest_invite_contest_user_idx" ON "contest_invite" USING btree ("contest_id","user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "contest_registrations_unique_contest_user_registration" ON "contest_registrations" USING btree ("contest_id","registered_user_id");--> statement-breakpoint
CREATE INDEX "contests_job_idx" ON "contests" USING btree ("job_id");--> statement-breakpoint
CREATE INDEX "contests_start_at_idx" ON "contests" USING btree ("start_at");--> statement-breakpoint
CREATE INDEX "contests_end_at_idx" ON "contests" USING btree ("end_at");--> statement-breakpoint
CREATE INDEX "contests_publish_state_idx" ON "contests" USING btree ("publish_state");--> statement-breakpoint
CREATE INDEX "contests_created_at_idx" ON "contests" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "jobs_org_id_idx" ON "jobs" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "jobs_slug_idx" ON "jobs" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "jobs_status_idx" ON "jobs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "jobs_type_idx" ON "jobs" USING btree ("type");--> statement-breakpoint
CREATE INDEX "jobs_screening_type_idx" ON "jobs" USING btree ("screening_type");--> statement-breakpoint
CREATE INDEX "jobs_created_at_idx" ON "jobs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "problems_title_idx" ON "problems" USING btree ("title");--> statement-breakpoint
CREATE INDEX "problems_author_id_idx" ON "problems" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "problems_difficulty_idx" ON "problems" USING btree ("difficulty");--> statement-breakpoint
CREATE INDEX "problems_contest_id_idx" ON "problems" USING btree ("contest_id");--> statement-breakpoint
CREATE INDEX "problems_points_idx" ON "problems" USING btree ("points");--> statement-breakpoint
CREATE INDEX "problems_created_at_idx" ON "problems" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "testcases_problem_idx" ON "testcases" USING btree ("problem_id");--> statement-breakpoint
CREATE INDEX "testcases_slug_idx" ON "testcases" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "idx_submissions_author" ON "submissions" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "idx_submissions_problem" ON "submissions" USING btree ("problem_id");--> statement-breakpoint
CREATE INDEX "idx_submissions_status" ON "submissions" USING btree ("submission_status");--> statement-breakpoint
CREATE INDEX "idx_submissions_contest" ON "submissions" USING btree ("contest_id");--> statement-breakpoint
CREATE INDEX "idx_submissions_submitted_at" ON "submissions" USING btree ("submitted_at");--> statement-breakpoint
CREATE INDEX "idx_submissions_contest_problem" ON "submissions" USING btree ("contest_id","problem_id");--> statement-breakpoint
CREATE INDEX "idx_submissions_plagiarized" ON "submissions" USING btree ("is_plagiarized");--> statement-breakpoint
CREATE INDEX "organization_invite_organizationId_idx" ON "organization_invite" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "organization_invite_code_idx" ON "organization_invite" USING btree ("code");--> statement-breakpoint
CREATE INDEX "organization_invite_createdBy_idx" ON "organization_invite" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "organization_invite_status_idx" ON "organization_invite" USING btree ("status");