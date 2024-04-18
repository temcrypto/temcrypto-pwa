DO $$ BEGIN
 CREATE TYPE "tx_currency" AS ENUM('BRL', 'USDT');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "currency" TYPE tx_currency USING (currency::text::tx_currency);
