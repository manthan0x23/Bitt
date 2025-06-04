ALTER TABLE "jobs" ALTER COLUMN "end_date" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "resume_required" boolean DEFAULT false NOT NULL;--> statement-breakpoint
CREATE INDEX "jobs_resume_required_idx" ON "jobs" USING btree ("resume_required");