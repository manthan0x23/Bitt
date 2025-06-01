CREATE TYPE "public"."code_language_enum" AS ENUM('cpp20', 'python3', 'java', 'javascript');--> statement-breakpoint
CREATE TYPE "public"."submission_status_enum" AS ENUM('PD', 'QU', 'RN', 'AC', 'WA', 'TLE', 'MLE', 'RE', 'CE', 'OLE', 'PE', 'IE', 'SE', 'RJ');--> statement-breakpoint
CREATE TYPE "public"."code_verdict_enum" AS ENUM('Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Memory Limit Exceeded', 'Runtime Error', 'Compilation Error', 'Output Limit Exceeded', 'Presentation Error', 'Internal Error', 'System Error', 'Rejected', 'Pending', 'In Queue', 'Running', 'Plagiarized', 'Skipped');--> statement-breakpoint
CREATE TYPE "public"."contest_invite_status_enum" AS ENUM('accepted', 'rejected', 'idle', 'expired');--> statement-breakpoint
CREATE TYPE "public"."organization_invite_type_enum" AS ENUM('open-for-all', 'strict');--> statement-breakpoint
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
	"allowed_origins" varchar(512)[] DEFAULT '{}',
	"invite_type" "organization_invite_type_enum" DEFAULT 'strict' NOT NULL,
	"usage_limit" integer DEFAULT 1 NOT NULL,
	"usage_count" integer DEFAULT 0 NOT NULL,
	"created_by" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "organization_invite_code_unique" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "resume" varchar(256);--> statement-breakpoint
ALTER TABLE "contest_invite" ADD CONSTRAINT "contest_invite_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contest_invite" ADD CONSTRAINT "contest_invite_contest_id_contests_contests_fk" FOREIGN KEY ("contest_id") REFERENCES "public"."contests"("contests") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contest_registrations" ADD CONSTRAINT "contest_registrations_contest_id_contests_contests_fk" FOREIGN KEY ("contest_id") REFERENCES "public"."contests"("contests") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contest_registrations" ADD CONSTRAINT "contest_registrations_registered_user_id_users_id_fk" FOREIGN KEY ("registered_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_author_id_contest_registrations_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."contest_registrations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_problem_id_problems_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."problems"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_invite" ADD CONSTRAINT "organization_invite_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_invite" ADD CONSTRAINT "organization_invite_created_by_admins_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."admins"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "contest_invite_contest_user_idx" ON "contest_invite" USING btree ("contest_id","user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "contest_registrations_unique_contest_user_registration" ON "contest_registrations" USING btree ("contest_id","registered_user_id");--> statement-breakpoint
CREATE INDEX "idx_submissions_author" ON "submissions" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "idx_submissions_problem" ON "submissions" USING btree ("problem_id");--> statement-breakpoint
CREATE INDEX "idx_submissions_status" ON "submissions" USING btree ("submission_status");--> statement-breakpoint
CREATE INDEX "idx_submissions_contest" ON "submissions" USING btree ("contest_id");--> statement-breakpoint
CREATE INDEX "idx_submissions_submitted_at" ON "submissions" USING btree ("submitted_at");--> statement-breakpoint
CREATE INDEX "idx_submissions_contest_problem" ON "submissions" USING btree ("contest_id","problem_id");--> statement-breakpoint
CREATE INDEX "idx_submissions_plagiarized" ON "submissions" USING btree ("is_plagiarized");--> statement-breakpoint
CREATE INDEX "organization_invite_organizationId_idx" ON "organization_invite" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "organization_invite_code_idx" ON "organization_invite" USING btree ("code");--> statement-breakpoint
CREATE INDEX "organization_invite_createdBy_idx" ON "organization_invite" USING btree ("created_by");