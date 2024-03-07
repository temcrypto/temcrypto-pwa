DO $$ BEGIN
 CREATE TYPE "status" AS ENUM('mined', 'dropped', 'processing', 'done', 'failed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "type" AS ENUM('pay', 'charge');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "status" SET DATA TYPE status;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "type" "type" NOT NULL;