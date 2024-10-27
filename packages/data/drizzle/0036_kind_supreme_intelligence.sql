CREATE TYPE "public"."weaponDeliveryType" AS ENUM('missile', 'projectile', 'beam', 'instant');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "shipComponentResourceCosts" (
	"shipComponentId" uuid NOT NULL,
	"resourceId" uuid NOT NULL,
	"quantity" numeric(30, 6) NOT NULL,
	CONSTRAINT "shipComponentResourceCosts_shipComponentId_resourceId_pk" PRIMARY KEY("shipComponentId","resourceId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "shipComponents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"gameId" uuid NOT NULL,
	"ownerId" uuid NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" text NOT NULL,
	"supplyNeed" numeric(30, 6) NOT NULL,
	"powerNeed" numeric(30, 6) NOT NULL,
	"crewNeed" numeric(30, 6) NOT NULL,
	"constructionCost" numeric(30, 6) NOT NULL,
	"supplyCapacity" numeric(30, 6),
	"powerGeneration" numeric(30, 6),
	"crewCapacity" numeric(30, 6),
	"ftlSpeed" numeric(30, 6),
	"zoneOfControl" numeric(30, 6),
	"sensorRange" numeric(30, 6),
	"hullBoost" numeric(30, 6),
	"thruster" numeric(30, 6),
	"sensorPrecision" numeric(30, 6),
	"armorThickness" numeric(30, 6),
	"armorEffectivenessAgainst" jsonb,
	"shieldStrength" numeric(30, 6),
	"shieldEffectivenessAgainst" jsonb,
	"weaponDamage" numeric(30, 6),
	"weaponCooldown" numeric(30, 6),
	"weaponRange" numeric(30, 6),
	"weaponArmorPenetration" numeric(30, 6),
	"weaponShieldPenetration" numeric(30, 6),
	"weaponAccuracy" numeric(30, 6),
	"weaponDeliveryType" "weaponDeliveryType"
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "shipDesignComponents" (
	"shipDesignId" uuid NOT NULL,
	"shipComponentId" uuid NOT NULL,
	CONSTRAINT "shipDesignComponents_shipDesignId_shipComponentId_pk" PRIMARY KEY("shipDesignId","shipComponentId")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shipComponentResourceCosts" ADD CONSTRAINT "shipComponentResourceCosts_shipComponentId_shipComponents_id_fk" FOREIGN KEY ("shipComponentId") REFERENCES "public"."shipComponents"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shipComponentResourceCosts" ADD CONSTRAINT "shipComponentResourceCosts_resourceId_resources_id_fk" FOREIGN KEY ("resourceId") REFERENCES "public"."resources"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shipComponents" ADD CONSTRAINT "shipComponents_gameId_games_id_fk" FOREIGN KEY ("gameId") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shipComponents" ADD CONSTRAINT "shipComponents_ownerId_users_id_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shipDesignComponents" ADD CONSTRAINT "shipDesignComponents_shipDesignId_shipDesigns_id_fk" FOREIGN KEY ("shipDesignId") REFERENCES "public"."shipDesigns"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shipDesignComponents" ADD CONSTRAINT "shipDesignComponents_shipComponentId_shipComponents_id_fk" FOREIGN KEY ("shipComponentId") REFERENCES "public"."shipComponents"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
DROP VIEW "public"."visibility";
--> statement-breakpoint
DROP VIEW "public"."taskForceShipsWithStats";
--> statement-breakpoint
--> statement-breakpoint
ALTER TABLE "shipDesigns" DROP COLUMN IF EXISTS "hullRating";--> statement-breakpoint
ALTER TABLE "shipDesigns" DROP COLUMN IF EXISTS "speedRating";--> statement-breakpoint
ALTER TABLE "shipDesigns" DROP COLUMN IF EXISTS "armorRating";--> statement-breakpoint
ALTER TABLE "shipDesigns" DROP COLUMN IF EXISTS "shieldRating";--> statement-breakpoint
ALTER TABLE "shipDesigns" DROP COLUMN IF EXISTS "weaponRating";--> statement-breakpoint
ALTER TABLE "shipDesigns" DROP COLUMN IF EXISTS "zoneOfControlRating";--> statement-breakpoint
ALTER TABLE "shipDesigns" DROP COLUMN IF EXISTS "sensorRating";--> statement-breakpoint
ALTER TABLE "shipDesigns" DROP COLUMN IF EXISTS "supplyNeed";--> statement-breakpoint
ALTER TABLE "shipDesigns" DROP COLUMN IF EXISTS "supplyCapacity";--> statement-breakpoint
ALTER TABLE "taskForceShips" DROP COLUMN IF EXISTS "hullState";--> statement-breakpoint
ALTER TABLE "taskForceShips" DROP COLUMN IF EXISTS "speedState";--> statement-breakpoint
ALTER TABLE "taskForceShips" DROP COLUMN IF EXISTS "shieldState";--> statement-breakpoint
ALTER TABLE "taskForceShips" DROP COLUMN IF EXISTS "armorState";--> statement-breakpoint
ALTER TABLE "taskForceShips" DROP COLUMN IF EXISTS "weaponState";--> statement-breakpoint
ALTER TABLE "taskForceShips" DROP COLUMN IF EXISTS "sensorState";--> statement-breakpoint
ALTER TABLE "taskForceShips" DROP COLUMN IF EXISTS "supplyCarried";--> statement-breakpoint
