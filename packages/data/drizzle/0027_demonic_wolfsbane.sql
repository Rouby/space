ALTER TABLE "shipDesigns" ADD COLUMN "sensorRating" numeric(30, 6) DEFAULT '1' NOT NULL;--> statement-breakpoint
ALTER TABLE "taskForceShips" ADD COLUMN "sensorState" numeric(30, 6) DEFAULT '1' NOT NULL;
ALTER TABLE "taskForceShips" ADD COLUMN "speedState" numeric(30, 6) DEFAULT '1' NOT NULL;