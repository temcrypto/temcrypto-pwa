DO $$ BEGIN
 CREATE TYPE "tx_status" AS ENUM('mined', 'dropped', 'processing', 'done', 'failed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "tx_type" AS ENUM('pay', 'charge');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "status" TYPE tx_status USING (status::text::tx_status);--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "type" TYPE tx_type USING (type::text::tx_type);
