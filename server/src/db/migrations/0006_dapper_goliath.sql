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
ALTER TABLE "quizes" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "quizes" ALTER COLUMN "no_of_questions" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "quiz_problems" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "quiz_problems" ALTER COLUMN "id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "quiz_problems" ADD CONSTRAINT "quiz_problems_id_unique" UNIQUE("id");