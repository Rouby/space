CREATE TABLE IF NOT EXISTS "lastKnownStates" (
	"userId" uuid NOT NULL,
	"gameId" uuid NOT NULL,
	"subjectId" uuid NOT NULL,
	"state" jsonb NOT NULL,
	"lastUpdate" timestamp NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lastKnownStates" ADD CONSTRAINT "lastKnownStates_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lastKnownStates" ADD CONSTRAINT "lastKnownStates_gameId_games_id_fk" FOREIGN KEY ("gameId") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
