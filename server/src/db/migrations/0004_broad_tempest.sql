ALTER TABLE "quizes" ADD COLUMN "no_of_questions" integer DEFAULT 10;--> statement-breakpoint
ALTER TABLE "quiz_problems" ADD COLUMN "quizId" varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE "quiz_problems" ADD CONSTRAINT "quiz_problems_quizId_quizes_id_fk" FOREIGN KEY ("quizId") REFERENCES "public"."quizes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "quiz_id_problem_idx" ON "quiz_problems" USING btree ("quizId");