ALTER TABLE "organizations_table" RENAME TO "organizations";--> statement-breakpoint
ALTER TABLE "organizations" DROP CONSTRAINT "organizations_table_id_unique";--> statement-breakpoint
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_id_unique" UNIQUE("id");