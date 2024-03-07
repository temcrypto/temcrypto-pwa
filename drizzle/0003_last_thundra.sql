ALTER TABLE "transactions" ADD COLUMN "amount" numeric NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "pix_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "pix_key" text NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "pix_key_reformated" text NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_id_idx" ON "transactions" ("user_id");