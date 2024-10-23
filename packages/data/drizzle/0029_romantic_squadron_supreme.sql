CREATE TABLE IF NOT EXISTS "starSystemPopulations" (
	"starSystemId" uuid NOT NULL,
	"amount" bigint NOT NULL,
	"allegianceToPlayerId" uuid,
	CONSTRAINT "starSystemPopulations_starSystemId_allegianceToPlayerId_pk" PRIMARY KEY("starSystemId","allegianceToPlayerId")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "starSystemPopulations" ADD CONSTRAINT "starSystemPopulations_starSystemId_starSystems_id_fk" FOREIGN KEY ("starSystemId") REFERENCES "public"."starSystems"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "starSystemPopulations" ADD CONSTRAINT "starSystemPopulations_allegianceToPlayerId_users_id_fk" FOREIGN KEY ("allegianceToPlayerId") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
