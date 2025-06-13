ALTER TABLE "contests" ALTER COLUMN "available_for_practise" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "contests" ALTER COLUMN "available_for_practise" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "contests" ADD COLUMN "requires_video_monitoring" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "contests" ADD COLUMN "required_audio_monitoring" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "contests" ADD COLUMN "requires_ai_monitoring" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "contests" ADD COLUMN "requires_screen_monitoring" boolean DEFAULT false;