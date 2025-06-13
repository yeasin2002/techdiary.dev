ALTER TABLE "comments" ADD COLUMN "resource_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "comments" ADD COLUMN "resource_type" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "comments" DROP COLUMN "commentable_type";--> statement-breakpoint
ALTER TABLE "comments" DROP COLUMN "commentable_id";