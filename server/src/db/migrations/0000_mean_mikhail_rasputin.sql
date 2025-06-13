CREATE TYPE "public"."account_source" AS ENUM('google', 'credentials');--> statement-breakpoint
CREATE TYPE "public"."contest_access" AS ENUM('public', 'private', 'invite-only');--> statement-breakpoint
CREATE TYPE "public"."contest_publish_state_enum" AS ENUM('draft', 'open', 'closed', 'archived');--> statement-breakpoint
CREATE TYPE "public"."contest_type" AS ENUM('live', 'take-home', 'practise', 'upsolve');--> statement-breakpoint
CREATE TYPE "public"."job_status" AS ENUM('draft', 'open', 'closed', 'archived');--> statement-breakpoint
CREATE TYPE "public"."job_type" AS ENUM('internship', 'full-time', 'part-time');--> statement-breakpoint
CREATE TYPE "public"."screening_type" AS ENUM('application', 'multi-stage');--> statement-breakpoint
CREATE TYPE "public"."problem_state" AS ENUM('draft', 'live');--> statement-breakpoint
CREATE TYPE "public"."code_language_enum" AS ENUM('cpp20', 'python3', 'java', 'javascript');--> statement-breakpoint
CREATE TYPE "public"."submission_status_enum" AS ENUM('PD', 'QU', 'RN', 'AC', 'WA', 'TLE', 'MLE', 'RE', 'CE', 'OLE', 'PE', 'IE', 'SE', 'RJ');--> statement-breakpoint
CREATE TYPE "public"."code_verdict_enum" AS ENUM('Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Memory Limit Exceeded', 'Runtime Error', 'Compilation Error', 'Output Limit Exceeded', 'Presentation Error', 'Internal Error', 'System Error', 'Rejected', 'Pending', 'In Queue', 'Running', 'Plagiarized', 'Skipped');--> statement-breakpoint
CREATE TYPE "public"."contest_invite_status_enum" AS ENUM('accepted', 'rejected', 'idle', 'expired');--> statement-breakpoint
CREATE TYPE "public"."organization_invite_status_enum" AS ENUM('active', 'closed', 'expired', 'limit_reached', 'deleted');--> statement-breakpoint
CREATE TYPE "public"."organization_invite_type_enum" AS ENUM('open-for-all', 'strict');--> statement-breakpoint
CREATE TYPE "public"."stage_select_type" AS ENUM('strict', 'relax');--> statement-breakpoint
CREATE TYPE "public"."stage_flow_criteria" AS ENUM('automatic', 'manual');--> statement-breakpoint
CREATE TYPE "public"."stage_status_enum" AS ENUM('upcomming', 'ongoing', 'completed');--> statement-breakpoint
CREATE TYPE "public"."stage_type_enum" AS ENUM('contest', 'quiz', 'resume_filter', 'interview');--> statement-breakpoint
CREATE TYPE "public"."quiz_status_enum" AS ENUM('draft', 'open', 'closed', 'archived');--> statement-breakpoint
CREATE TYPE "public"."quiz_type_enum" AS ENUM('live', 'take-home', 'practise', 'upsolve');--> statement-breakpoint
CREATE TYPE "public"."interview_type_enum" AS ENUM('ai', 'manual');--> statement-breakpoint
CREATE TYPE "public"."resume_filters_type_enum" AS ENUM('ai', 'manual', 'hybrid');--> statement-breakpoint
CREATE TYPE "public"."quiz_problem_difficulty_enum" AS ENUM('easy', 'medium', 'hard');--> statement-breakpoint
CREATE TYPE "public"."quiz_problem_type_enum" AS ENUM('multiple_choice', 'multiple_select', 'text');--> statement-breakpoint
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
CREATE TABLE "contest_problems_testcases" (
	"id" varchar PRIMARY KEY NOT NULL,
	"slug" varchar(256) NOT NULL,
	"test_case_index" integer NOT NULL,
	"problem_id" varchar(256) NOT NULL,
	"points" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_test_case_index_problem_idx" UNIQUE("test_case_index","problem_id")
);
--> statement-breakpoint
CREATE TABLE "contest_problems" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"description" text NOT NULL,
	"problem_index" integer NOT NULL,
	"solution" text,
	"input_description" text,
	"output_description" text,
	"constraints" text,
	"hint" text,
	"sample_input" text,
	"sample_output" text,
	"points" integer DEFAULT 100 NOT NULL,
	"difficulty" numeric DEFAULT '1.0' NOT NULL,
	"time_limit_ms" integer DEFAULT 1000 NOT NULL,
	"memory_limit_mb" integer DEFAULT 256 NOT NULL,
	"number_of_problems" integer DEFAULT 1,
	"author_id" varchar,
	"contest_id" varchar NOT NULL,
	"tags" json,
	"partial_marks" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "problem_contest_unqiue_index_idx" UNIQUE("problem_index","contest_id")
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
	"stage_id" varchar(256) NOT NULL,
	"start_at" timestamp NOT NULL,
	"end_at" timestamp NOT NULL,
	"duration" bigint DEFAULT 0,
	"contest_type" "contest_type" DEFAULT 'live' NOT NULL,
	"accessibility" "contest_access" DEFAULT 'public' NOT NULL,
	"available_for_practise" boolean DEFAULT true NOT NULL,
	"publish_state" "contest_publish_state_enum" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "contests_stage_id_unique" UNIQUE("stage_id")
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
	"screening_type" "screening_type" DEFAULT 'multi-stage' NOT NULL,
	"end_date" timestamp NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"resume_required" boolean DEFAULT false NOT NULL,
	"cover_letter_required" boolean DEFAULT false NOT NULL,
	"is_creation_complete" boolean DEFAULT false NOT NULL,
	"experience" integer DEFAULT 0 NOT NULL,
	"openings" integer DEFAULT 1 NOT NULL,
	"organization_id" varchar(256) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "slud_org_unique_idx" UNIQUE("organization_id","slug")
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
CREATE TABLE "stages" (
	"id" varchar(256) NOT NULL,
	"stage_index" integer DEFAULT 1 NOT NULL,
	"type" "stage_type_enum" DEFAULT 'contest' NOT NULL,
	"inflow" integer DEFAULT 2000 NOT NULL,
	"outflow" integer DEFAULT 100 NOT NULL,
	"description" text NOT NULL,
	"selectionCriteria" "stage_flow_criteria" DEFAULT 'automatic' NOT NULL,
	"selectType" "stage_select_type" DEFAULT 'relax' NOT NULL,
	"is_final" boolean DEFAULT false,
	"start_at" timestamp with time zone NOT NULL,
	"end_at" timestamp with time zone NOT NULL,
	"job_id" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"second_table_id" varchar,
	CONSTRAINT "stages_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "interviews" (
	"id" varchar(256) NOT NULL,
	"title" varchar(256) NOT NULL,
	"description" text,
	"stage_id" varchar NOT NULL,
	"start_at" timestamp,
	"end_at" timestamp,
	"type" "interview_type_enum" DEFAULT 'manual',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "interviews_id_unique" UNIQUE("id"),
	CONSTRAINT "interviews_stage_id_unique" UNIQUE("stage_id")
);
--> statement-breakpoint
CREATE TABLE "quizes" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"title" varchar,
	"description" text,
	"instructions" text,
	"stage_id" varchar NOT NULL,
	"no_of_questions" integer DEFAULT 10 NOT NULL,
	"tags" json DEFAULT '[]'::json NOT NULL,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"duration" bigint DEFAULT 0,
	"end_at" timestamp DEFAULT now() NOT NULL,
	"type" "quiz_type_enum" DEFAULT 'live',
	"status" "quiz_status_enum" DEFAULT 'draft',
	"state" "contest_access" DEFAULT 'public',
	"requires_video_monitoring" boolean DEFAULT false,
	"required_audio_monitoring" boolean DEFAULT false,
	"requires_ai_monitoring" boolean DEFAULT false,
	"requires_screen_monitoring" boolean DEFAULT false,
	"available_for_practise" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "quizes_id_unique" UNIQUE("id"),
	CONSTRAINT "quizes_stage_id_unique" UNIQUE("stage_id")
);
--> statement-breakpoint
CREATE TABLE "resume_filters" (
	"id" varchar(256) NOT NULL,
	"stage_id" varchar NOT NULL,
	"end_at" timestamp DEFAULT now(),
	"resumeFilterType" "resume_filters_type_enum" DEFAULT 'hybrid',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "resume_filters_id_unique" UNIQUE("id"),
	CONSTRAINT "resume_filters_stage_id_unique" UNIQUE("stage_id")
);
--> statement-breakpoint
CREATE TABLE "quiz_problems" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"type" "quiz_problem_type_enum" DEFAULT 'multiple_choice' NOT NULL,
	"question" text,
	"question_index" integer DEFAULT 1 NOT NULL,
	"quizId" varchar(256) NOT NULL,
	"choices" json DEFAULT '[]'::json,
	"answer" json,
	"text_answer" text,
	"explanation" text,
	"points" integer DEFAULT 4,
	"difficulty" "quiz_problem_difficulty_enum" DEFAULT 'medium',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "quiz_problems_id_unique" UNIQUE("id"),
	CONSTRAINT "quiz_id_question_index_idx" UNIQUE("quizId","question_index")
);
--> statement-breakpoint
CREATE TABLE "prompts" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"prompt" text,
	"result" text,
	"prompt_tokens" integer,
	"completion_tokens" integer,
	"total_tokens" integer,
	"finish_reason" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "prompts_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "contest_invite" ADD CONSTRAINT "contest_invite_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contest_invite" ADD CONSTRAINT "contest_invite_contest_id_contests_contests_fk" FOREIGN KEY ("contest_id") REFERENCES "public"."contests"("contests") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contest_problems_testcases" ADD CONSTRAINT "contest_problems_testcases_problem_id_contest_problems_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."contest_problems"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contest_problems" ADD CONSTRAINT "contest_problems_author_id_admins_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."admins"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contest_problems" ADD CONSTRAINT "contest_problems_contest_id_contests_contests_fk" FOREIGN KEY ("contest_id") REFERENCES "public"."contests"("contests") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contest_registrations" ADD CONSTRAINT "contest_registrations_contest_id_contests_contests_fk" FOREIGN KEY ("contest_id") REFERENCES "public"."contests"("contests") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contest_registrations" ADD CONSTRAINT "contest_registrations_registered_user_id_users_id_fk" FOREIGN KEY ("registered_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contests" ADD CONSTRAINT "contests_stage_id_stages_id_fk" FOREIGN KEY ("stage_id") REFERENCES "public"."stages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_author_id_contest_registrations_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."contest_registrations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_problem_id_contest_problems_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."contest_problems"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_invite" ADD CONSTRAINT "organization_invite_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_invite" ADD CONSTRAINT "organization_invite_created_by_admins_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."admins"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stages" ADD CONSTRAINT "stages_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interviews" ADD CONSTRAINT "interviews_stage_id_stages_id_fk" FOREIGN KEY ("stage_id") REFERENCES "public"."stages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quizes" ADD CONSTRAINT "quizes_stage_id_stages_id_fk" FOREIGN KEY ("stage_id") REFERENCES "public"."stages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resume_filters" ADD CONSTRAINT "resume_filters_stage_id_stages_id_fk" FOREIGN KEY ("stage_id") REFERENCES "public"."stages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_problems" ADD CONSTRAINT "quiz_problems_quizId_quizes_id_fk" FOREIGN KEY ("quizId") REFERENCES "public"."quizes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "contest_invite_contest_user_idx" ON "contest_invite" USING btree ("contest_id","user_id");--> statement-breakpoint
CREATE INDEX "contest_problems_testcases_problem_idx" ON "contest_problems_testcases" USING btree ("problem_id");--> statement-breakpoint
CREATE INDEX "contest_problems_testcases_slug_idx" ON "contest_problems_testcases" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "problems_title_idx" ON "contest_problems" USING btree ("title");--> statement-breakpoint
CREATE INDEX "problems_author_id_idx" ON "contest_problems" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "problems_difficulty_idx" ON "contest_problems" USING btree ("difficulty");--> statement-breakpoint
CREATE INDEX "problems_contest_id_idx" ON "contest_problems" USING btree ("contest_id");--> statement-breakpoint
CREATE INDEX "problems_points_idx" ON "contest_problems" USING btree ("points");--> statement-breakpoint
CREATE INDEX "problems_created_at_idx" ON "contest_problems" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "contest_registrations_unique_contest_user_registration" ON "contest_registrations" USING btree ("contest_id","registered_user_id");--> statement-breakpoint
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
CREATE INDEX "jobs_resume_required_idx" ON "jobs" USING btree ("resume_required");--> statement-breakpoint
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
CREATE INDEX "organization_invite_status_idx" ON "organization_invite" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "stage_job_id_index" ON "stages" USING btree ("job_id","stage_index");--> statement-breakpoint
CREATE INDEX "interview_type_index" ON "interviews" USING btree ("type");--> statement-breakpoint
CREATE INDEX "quiz_type_index" ON "quizes" USING btree ("type");--> statement-breakpoint
CREATE INDEX "quiz_status_index" ON "quizes" USING btree ("status");--> statement-breakpoint
CREATE INDEX "quiz_state_index" ON "quizes" USING btree ("status");--> statement-breakpoint
CREATE INDEX "quiz_id_problem_idx" ON "quiz_problems" USING btree ("quizId");