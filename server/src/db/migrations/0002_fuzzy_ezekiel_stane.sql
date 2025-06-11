ALTER TABLE "quizes" ADD COLUMN "instructions" text;--> statement-breakpoint
ALTER TABLE "quizes" ADD COLUMN "requires_video_monitoring" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "quizes" ADD COLUMN "required_audio_monitoring" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "quizes" ADD COLUMN "requires_ai_monitoring" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "quizes" ADD COLUMN "requires_screen_monitoring" boolean DEFAULT false;