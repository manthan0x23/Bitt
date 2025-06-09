ALTER TABLE "contests" DROP CONSTRAINT "contests_stage_id_jobs_id_fk";
--> statement-breakpoint
ALTER TABLE "contests" ADD CONSTRAINT "contests_stage_id_stages_id_fk" FOREIGN KEY ("stage_id") REFERENCES "public"."stages"("id") ON DELETE cascade ON UPDATE no action;