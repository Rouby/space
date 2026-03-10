ALTER TABLE "taskForceEngagements" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "taskForceEngagements" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "taskForceEngagements" ADD COLUMN "phase" varchar(64) DEFAULT 'awaiting_submissions' NOT NULL;--> statement-breakpoint
ALTER TABLE "taskForceEngagements" ADD COLUMN "currentRound" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "taskForceEngagements" ADD COLUMN "stateA" json;--> statement-breakpoint
ALTER TABLE "taskForceEngagements" ADD COLUMN "stateB" json;--> statement-breakpoint
ALTER TABLE "taskForceEngagements" ADD COLUMN "submittedCardIdA" varchar(64);--> statement-breakpoint
ALTER TABLE "taskForceEngagements" ADD COLUMN "submittedCardIdB" varchar(64);--> statement-breakpoint
ALTER TABLE "taskForceEngagements" ADD COLUMN "roundLog" json DEFAULT '[]'::json NOT NULL;--> statement-breakpoint
ALTER TABLE "taskForceEngagements" ADD COLUMN "winnerTaskForceId" uuid;--> statement-breakpoint
ALTER TABLE "taskForceEngagements" ADD CONSTRAINT "taskForceEngagements_winnerTaskForceId_taskForces_id_fk" FOREIGN KEY ("winnerTaskForceId") REFERENCES "public"."taskForces"("id") ON DELETE set null ON UPDATE no action;