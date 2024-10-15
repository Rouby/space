DO $$ BEGIN
 CREATE TYPE "public"."taskForceShipRole" AS ENUM('capital', 'screen', 'carrier', 'scout', 'support', 'transport');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "taskForceResourceNeeds" (
	"taskForceShipCommisionId" uuid NOT NULL,
	"resourceId" uuid NOT NULL,
	"alotted" numeric(30, 6) NOT NULL,
	"needed" numeric(30, 6) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "taskForceShipCommisions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"gameId" uuid NOT NULL,
	"starSystemId" uuid NOT NULL,
	"shipDesignId" uuid NOT NULL,
	"taskForceId" uuid NOT NULL,
	"name" varchar(256) NOT NULL,
	"role" "taskForceShipRole" NOT NULL,
	"progress" numeric(30, 6) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "taskForceShip" (
	"taskForceId" uuid NOT NULL,
	"shipDesignId" uuid NOT NULL,
	"name" varchar(256) NOT NULL,
	"role" "taskForceShipRole" NOT NULL,
	"hullState" numeric(30, 6) NOT NULL,
	"shieldState" numeric(30, 6) NOT NULL,
	"armorState" numeric(30, 6) NOT NULL,
	"weaponState" numeric(30, 6) NOT NULL,
	"supplyCarried" numeric(30, 6) NOT NULL
);
--> statement-breakpoint
DROP TABLE "taskForceCommisions";--> statement-breakpoint
DROP TABLE "shipsInTaskForces";--> statement-breakpoint
ALTER TABLE "shipDesigns" ALTER COLUMN "ownerId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "shipDesigns" ALTER COLUMN "hullRating" SET DATA TYPE numeric(30, 6);--> statement-breakpoint
ALTER TABLE "shipDesigns" ALTER COLUMN "speedRating" SET DATA TYPE numeric(30, 6);--> statement-breakpoint
ALTER TABLE "shipDesigns" ALTER COLUMN "armorRating" SET DATA TYPE numeric(30, 6);--> statement-breakpoint
ALTER TABLE "shipDesigns" ALTER COLUMN "shieldRating" SET DATA TYPE numeric(30, 6);--> statement-breakpoint
ALTER TABLE "shipDesigns" ALTER COLUMN "weaponRating" SET DATA TYPE numeric(30, 6);--> statement-breakpoint
ALTER TABLE "shipDesigns" ALTER COLUMN "zoneOfControlRating" SET DATA TYPE numeric(30, 6);--> statement-breakpoint
ALTER TABLE "shipDesigns" ALTER COLUMN "supplyNeed" SET DATA TYPE numeric(30, 6);--> statement-breakpoint
ALTER TABLE "shipDesigns" ALTER COLUMN "supplyCapacity" SET DATA TYPE numeric(30, 6);--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "taskForceResourceNeeds" ADD CONSTRAINT "taskForceResourceNeeds_taskForceShipCommisionId_taskForces_id_fk" FOREIGN KEY ("taskForceShipCommisionId") REFERENCES "public"."taskForces"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "taskForceResourceNeeds" ADD CONSTRAINT "taskForceResourceNeeds_resourceId_starSystems_id_fk" FOREIGN KEY ("resourceId") REFERENCES "public"."starSystems"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "taskForceShipCommisions" ADD CONSTRAINT "taskForceShipCommisions_gameId_games_id_fk" FOREIGN KEY ("gameId") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "taskForceShipCommisions" ADD CONSTRAINT "taskForceShipCommisions_starSystemId_starSystems_id_fk" FOREIGN KEY ("starSystemId") REFERENCES "public"."starSystems"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "taskForceShipCommisions" ADD CONSTRAINT "taskForceShipCommisions_shipDesignId_shipDesigns_id_fk" FOREIGN KEY ("shipDesignId") REFERENCES "public"."shipDesigns"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "taskForceShipCommisions" ADD CONSTRAINT "taskForceShipCommisions_taskForceId_taskForces_id_fk" FOREIGN KEY ("taskForceId") REFERENCES "public"."taskForces"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "taskForceShip" ADD CONSTRAINT "taskForceShip_taskForceId_taskForces_id_fk" FOREIGN KEY ("taskForceId") REFERENCES "public"."taskForces"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "taskForceShip" ADD CONSTRAINT "taskForceShip_shipDesignId_shipDesigns_id_fk" FOREIGN KEY ("shipDesignId") REFERENCES "public"."shipDesigns"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "taskForces" DROP COLUMN IF EXISTS "supply";