DO $$ BEGIN
 CREATE TYPE "public"."taskForceEngagementPhase" AS ENUM('locating', 'engagement', 'resolution');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "taskForceEngagements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"gameId" uuid NOT NULL,
	"position" "point" NOT NULL,
	"startedAt" timestamp NOT NULL,
	"phase" "taskForceEngagementPhase" DEFAULT 'locating' NOT NULL,
	"phaseProgress" real DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "taskForceEngagementsToTaskForces" (
	"taskForceEngagementId" uuid NOT NULL,
	"taskForceId" uuid NOT NULL,
	CONSTRAINT "taskForceEngagementsToTaskForces_taskForceEngagementId_taskForceId_pk" PRIMARY KEY("taskForceEngagementId","taskForceId")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "taskForceEngagements" ADD CONSTRAINT "taskForceEngagements_gameId_games_id_fk" FOREIGN KEY ("gameId") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "taskForceEngagementsToTaskForces" ADD CONSTRAINT "taskForceEngagementsToTaskForces_taskForceEngagementId_taskForceEngagements_id_fk" FOREIGN KEY ("taskForceEngagementId") REFERENCES "public"."taskForceEngagements"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "taskForceEngagementsToTaskForces" ADD CONSTRAINT "taskForceEngagementsToTaskForces_taskForceId_taskForces_id_fk" FOREIGN KEY ("taskForceId") REFERENCES "public"."taskForces"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
