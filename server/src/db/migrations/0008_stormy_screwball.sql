ALTER TABLE "stages" ADD COLUMN "description" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "stages" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "stages" ADD COLUMN "updated_at" timestamp DEFAULT now();