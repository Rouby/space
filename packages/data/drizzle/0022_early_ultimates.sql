DROP INDEX "shipDesignComponents_shipDesignId_column_row_index";--> statement-breakpoint
ALTER TABLE "shipDesignComponents" ADD COLUMN "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "taskForceShipDesigns" ADD COLUMN "quantity" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "taskForces" ADD COLUMN "mission" varchar(32) DEFAULT 'manual' NOT NULL;--> statement-breakpoint
CREATE INDEX "shipDesignComponents_shipDesignId_index" ON "shipDesignComponents" USING btree ("shipDesignId");--> statement-breakpoint
ALTER TABLE "shipDesignComponents" DROP COLUMN "column";--> statement-breakpoint
ALTER TABLE "shipDesignComponents" DROP COLUMN "row";