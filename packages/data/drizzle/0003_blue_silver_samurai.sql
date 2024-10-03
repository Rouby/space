CREATE TABLE IF NOT EXISTS "planets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256) NOT NULL,
	"starSystemId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "starSystems" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"gameId" uuid NOT NULL,
	"name" varchar(256) NOT NULL,
	"position" "point" NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "taskForces" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"gameId" uuid NOT NULL,
	"userId" uuid NOT NULL,
	"name" varchar(256) NOT NULL,
	"position" "point" NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "planets" ADD CONSTRAINT "planets_starSystemId_starSystems_id_fk" FOREIGN KEY ("starSystemId") REFERENCES "public"."starSystems"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "starSystems" ADD CONSTRAINT "starSystems_gameId_games_id_fk" FOREIGN KEY ("gameId") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "taskForces" ADD CONSTRAINT "taskForces_gameId_games_id_fk" FOREIGN KEY ("gameId") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "taskForces" ADD CONSTRAINT "taskForces_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
