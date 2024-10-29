ALTER TABLE "taskForceShipCommisions" RENAME COLUMN "progress" TO "constructionDone";--> statement-breakpoint
ALTER TABLE "taskForceShipCommisions" ALTER COLUMN "constructionDone" SET DEFAULT '0';--> statement-breakpoint
ALTER TABLE "taskForceShipCommisions" ADD COLUMN "constructionTotal" numeric(30, 6) DEFAULT '0' NOT NULL;