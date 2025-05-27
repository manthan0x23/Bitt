CREATE TYPE "public"."account_source" AS ENUM('google', 'credentials');--> statement-breakpoint
CREATE TABLE "admins" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256),
	"work_email" varchar NOT NULL,
	"password" text,
	"email_verified" boolean DEFAULT false,
	"picture_url" text,
	"account_source" "account_source" DEFAULT 'credentials' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"is_deleted" timestamp,
	"update_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "admins_id_unique" UNIQUE("id"),
	CONSTRAINT "admins_work_email_unique" UNIQUE("work_email")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256),
	"email" varchar(256) NOT NULL,
	"password" text,
	"picture_url" text,
	"email_verified" boolean DEFAULT false NOT NULL,
	"account_source" "account_source" DEFAULT 'credentials' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"is_deleted" timestamp,
	"update_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_id_unique" UNIQUE("id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "organizations_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"logo_url" text,
	"billing_email_address" text,
	"origin" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid NOT NULL,
	CONSTRAINT "organizations_table_id_unique" UNIQUE("id")
);
