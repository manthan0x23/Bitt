CREATE TYPE "public"."test_cases_type_enum" AS ENUM('example', 'system', 'hidden');--> statement-breakpoint
CREATE TABLE "testcases" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"contest_problem_id" varchar(256) NOT NULL,
	"input" varchar NOT NULL,
	"output" varchar NOT NULL,
	"type" "test_cases_type_enum" DEFAULT 'system',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "testcases_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "testcases" ADD CONSTRAINT "testcases_contest_problem_id_contest_problems_id_fk" FOREIGN KEY ("contest_problem_id") REFERENCES "public"."contest_problems"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contest_problems" DROP COLUMN "solution";--> statement-breakpoint
ALTER TABLE "contest_problems" DROP COLUMN "examples";