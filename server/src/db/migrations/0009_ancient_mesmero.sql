ALTER TABLE "quiz_problems" ALTER COLUMN "answer" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "quiz_problems" ADD COLUMN "text_answer" text;