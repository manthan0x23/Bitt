CREATE TYPE "public"."quiz_problem_difficulty_enum" AS ENUM('easy', 'medium', 'hard');--> statement-breakpoint
CREATE TYPE "public"."quiz_problem_type_enum" AS ENUM('multiple_choice', 'multiple_select', 'text');--> statement-breakpoint
CREATE TABLE "quiz_problems" (
	"id" varchar(256),
	"type" "quiz_problem_type_enum" DEFAULT 'multiple_choice' NOT NULL,
	"question" text NOT NULL,
	"choices" json DEFAULT '[]'::json,
	"answer" json NOT NULL,
	"explanation" text,
	"points" integer DEFAULT 4,
	"difficulty" "quiz_problem_difficulty_enum" DEFAULT 'medium',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
