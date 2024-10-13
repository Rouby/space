DO $$ BEGIN
 CREATE TYPE "public"."resourceKind" AS ENUM('metal', 'crystal', 'gas', 'liquid', 'biological');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "resources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"gameId" uuid NOT NULL,
	"name" varchar(256) NOT NULL,
	"kind" "resourceKind" NOT NULL,
	"description" text NOT NULL,
	"discoveryWeight" real NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "shipDesignResourceCosts" (
	"shipDesignId" uuid NOT NULL,
	"resourceId" uuid NOT NULL,
	"quantity" real NOT NULL,
	CONSTRAINT "shipDesignResourceCosts_shipDesignId_resourceId_pk" PRIMARY KEY("shipDesignId","resourceId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "shipDesigns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"gameId" uuid NOT NULL,
	"ownerId" uuid,
	"name" varchar(256) NOT NULL,
	"description" text NOT NULL,
	"decommissioned" boolean DEFAULT false NOT NULL,
	"previousVersionId" uuid,
	"hullRating" real NOT NULL,
	"speedRating" real NOT NULL,
	"armorRating" real NOT NULL,
	"shieldRating" real NOT NULL,
	"weaponRating" real NOT NULL,
	"zoneOfControlRating" real NOT NULL,
	"supplyNeed" real NOT NULL,
	"supplyCapacity" real NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "starSystemResourceDiscoveries" (
	"starSystemId" uuid NOT NULL,
	"resourceId" uuid NOT NULL,
	"discoveredAt" timestamp NOT NULL,
	"remainingDeposits" real NOT NULL,
	CONSTRAINT "starSystemResourceDiscoveries_starSystemId_resourceId_pk" PRIMARY KEY("starSystemId","resourceId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "shipsInTaskForces" (
	"taskForceId" uuid NOT NULL,
	"shipId" uuid NOT NULL,
	"integrity" real NOT NULL
);
--> statement-breakpoint
DROP TABLE "planets";--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "version" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "starSystems" ADD COLUMN "discoverySlots" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "taskForces" ADD COLUMN "supply" real DEFAULT 0 NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "resources" ADD CONSTRAINT "resources_gameId_games_id_fk" FOREIGN KEY ("gameId") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shipDesignResourceCosts" ADD CONSTRAINT "shipDesignResourceCosts_shipDesignId_shipDesigns_id_fk" FOREIGN KEY ("shipDesignId") REFERENCES "public"."shipDesigns"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shipDesignResourceCosts" ADD CONSTRAINT "shipDesignResourceCosts_resourceId_resources_id_fk" FOREIGN KEY ("resourceId") REFERENCES "public"."resources"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shipDesigns" ADD CONSTRAINT "shipDesigns_gameId_games_id_fk" FOREIGN KEY ("gameId") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shipDesigns" ADD CONSTRAINT "shipDesigns_ownerId_users_id_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shipDesigns" ADD CONSTRAINT "shipDesigns_previousVersionId_shipDesigns_id_fk" FOREIGN KEY ("previousVersionId") REFERENCES "public"."shipDesigns"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "starSystemResourceDiscoveries" ADD CONSTRAINT "starSystemResourceDiscoveries_starSystemId_starSystems_id_fk" FOREIGN KEY ("starSystemId") REFERENCES "public"."starSystems"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "starSystemResourceDiscoveries" ADD CONSTRAINT "starSystemResourceDiscoveries_resourceId_resources_id_fk" FOREIGN KEY ("resourceId") REFERENCES "public"."resources"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shipsInTaskForces" ADD CONSTRAINT "shipsInTaskForces_taskForceId_taskForces_id_fk" FOREIGN KEY ("taskForceId") REFERENCES "public"."taskForces"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shipsInTaskForces" ADD CONSTRAINT "shipsInTaskForces_shipId_taskForces_id_fk" FOREIGN KEY ("shipId") REFERENCES "public"."taskForces"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
