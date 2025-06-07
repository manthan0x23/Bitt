CREATE TABLE "interviews" (
	"id" varchar(256) NOT NULL,
	"title" varchar(256) NOT NULL,
	"description" text,
	"stage_id" varchar NOT NULL,
	"start_at" timestamp,
	"end_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "interviews_id_unique" UNIQUE("id"),
	CONSTRAINT "interviews_stage_id_unique" UNIQUE("stage_id")
);
--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "openings" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "interviews" ADD CONSTRAINT "interviews_stage_id_stages_id_fk" FOREIGN KEY ("stage_id") REFERENCES "public"."stages"("id") ON DELETE no action ON UPDATE no action;