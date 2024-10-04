CREATE TABLE IF NOT EXISTS "taskForceCommisions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"gameId" uuid NOT NULL,
	"starSystemId" uuid NOT NULL,
	"progress" real DEFAULT 0 NOT NULL,
	"total" real NOT NULL
);
--> statement-breakpoint
ALTER TABLE "taskForces" ADD COLUMN "orders" json NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "taskForceCommisions" ADD CONSTRAINT "taskForceCommisions_gameId_games_id_fk" FOREIGN KEY ("gameId") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "taskForceCommisions" ADD CONSTRAINT "taskForceCommisions_starSystemId_starSystems_id_fk" FOREIGN KEY ("starSystemId") REFERENCES "public"."starSystems"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
