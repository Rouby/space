CREATE TABLE IF NOT EXISTS "starSystemResourceDepots" (
	"starSystemId" uuid NOT NULL,
	"resourceId" uuid NOT NULL,
	"quantity" real NOT NULL,
	CONSTRAINT "starSystemResourceDepots_starSystemId_resourceId_pk" PRIMARY KEY("starSystemId","resourceId")
);
--> statement-breakpoint
ALTER TABLE "taskForces" ALTER COLUMN "supply" SET DEFAULT 0;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "starSystemResourceDepots" ADD CONSTRAINT "starSystemResourceDepots_starSystemId_starSystems_id_fk" FOREIGN KEY ("starSystemId") REFERENCES "public"."starSystems"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "starSystemResourceDepots" ADD CONSTRAINT "starSystemResourceDepots_resourceId_resources_id_fk" FOREIGN KEY ("resourceId") REFERENCES "public"."resources"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
