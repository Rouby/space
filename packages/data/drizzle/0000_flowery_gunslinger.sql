CREATE TYPE "public"."resourceKind" AS ENUM('metal', 'crystal', 'gas', 'liquid', 'biological');--> statement-breakpoint
CREATE TYPE "public"."weaponDeliveryType" AS ENUM('missile', 'projectile', 'beam', 'instant');--> statement-breakpoint
CREATE TABLE "dilemmas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"gameId" uuid NOT NULL,
	"ownerId" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"question" text NOT NULL,
	"choices" jsonb NOT NULL,
	"choosen" varchar(256),
	"position" "point",
	"correlation" jsonb,
	"causation" jsonb
);
--> statement-breakpoint
CREATE TABLE "games" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256) NOT NULL,
	"autoEndTurnAfterHoursInactive" integer DEFAULT 0 NOT NULL,
	"autoEndTurnEveryHours" integer DEFAULT 0 NOT NULL,
	"startedAt" timestamp,
	"setupCompleted" boolean DEFAULT false NOT NULL,
	"turnNumber" integer DEFAULT 0 NOT NULL,
	"version" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "players" (
	"userId" uuid NOT NULL,
	"gameId" uuid NOT NULL,
	"color" varchar(7) DEFAULT '#000000' NOT NULL,
	"turnEndedAt" timestamp,
	CONSTRAINT "players_userId_gameId_pk" PRIMARY KEY("userId","gameId")
);
--> statement-breakpoint
CREATE TABLE "lastKnownStates" (
	"userId" uuid NOT NULL,
	"gameId" uuid NOT NULL,
	"subjectId" uuid NOT NULL,
	"state" jsonb NOT NULL,
	"lastUpdate" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"gameId" uuid NOT NULL,
	"name" varchar(256) NOT NULL,
	"kind" "resourceKind" NOT NULL,
	"description" text NOT NULL,
	"discoveryWeight" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shipComponentResourceCosts" (
	"shipComponentId" uuid NOT NULL,
	"resourceId" uuid NOT NULL,
	"quantity" numeric(30, 6) NOT NULL,
	CONSTRAINT "shipComponentResourceCosts_shipComponentId_resourceId_pk" PRIMARY KEY("shipComponentId","resourceId")
);
--> statement-breakpoint
CREATE TABLE "shipComponents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"gameId" uuid NOT NULL,
	"ownerId" uuid NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" text NOT NULL,
	"layout" varchar(100) NOT NULL,
	"supplyNeedPassive" numeric(30, 6) NOT NULL,
	"supplyNeedMovement" numeric(30, 6) NOT NULL,
	"supplyNeedCombat" numeric(30, 6) NOT NULL,
	"powerNeed" numeric(30, 6) NOT NULL,
	"crewNeed" numeric(30, 6) NOT NULL,
	"constructionCost" numeric(30, 6) NOT NULL,
	"supplyCapacity" numeric(30, 6),
	"powerGeneration" numeric(30, 6),
	"crewCapacity" numeric(30, 6),
	"ftlSpeed" numeric(30, 6),
	"zoneOfControl" numeric(30, 6),
	"sensorRange" numeric(30, 6),
	"structuralIntegrity" numeric(30, 6),
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
CREATE TABLE "shipDesignComponents" (
	"shipDesignId" uuid NOT NULL,
	"shipComponentId" uuid NOT NULL,
	"column" integer NOT NULL,
	"row" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shipDesigns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"gameId" uuid NOT NULL,
	"ownerId" uuid NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" text NOT NULL,
	"decommissioned" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "starSystemPopulations" (
	"starSystemId" uuid NOT NULL,
	"amount" bigint NOT NULL,
	"growthLeftover" numeric(10, 9) DEFAULT '0' NOT NULL,
	"allegianceToPlayerId" uuid NOT NULL,
	CONSTRAINT "starSystemPopulations_starSystemId_allegianceToPlayerId_pk" PRIMARY KEY("starSystemId","allegianceToPlayerId")
);
--> statement-breakpoint
CREATE TABLE "starSystemResourceDepots" (
	"starSystemId" uuid NOT NULL,
	"resourceId" uuid NOT NULL,
	"quantity" numeric(30, 6) NOT NULL,
	CONSTRAINT "starSystemResourceDepots_starSystemId_resourceId_pk" PRIMARY KEY("starSystemId","resourceId")
);
--> statement-breakpoint
CREATE TABLE "starSystemResourceDiscoveries" (
	"starSystemId" uuid NOT NULL,
	"resourceId" uuid NOT NULL,
	"discoveredAt" timestamp NOT NULL,
	"remainingDeposits" numeric(30, 6) NOT NULL,
	CONSTRAINT "starSystemResourceDiscoveries_starSystemId_resourceId_pk" PRIMARY KEY("starSystemId","resourceId")
);
--> statement-breakpoint
CREATE TABLE "starSystems" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"gameId" uuid NOT NULL,
	"name" varchar(256) NOT NULL,
	"position" "point" NOT NULL,
	"ownerId" uuid,
	"discoverySlots" integer DEFAULT 0 NOT NULL,
	"discoveryProgress" numeric(10, 9) DEFAULT '0' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "taskForces" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"gameId" uuid NOT NULL,
	"ownerId" uuid NOT NULL,
	"name" varchar(256) NOT NULL,
	"position" "point" NOT NULL,
	"orders" json DEFAULT '[]'::json NOT NULL,
	"movementVector" "point"
);
--> statement-breakpoint
CREATE TABLE "passwords" (
	"userId" uuid PRIMARY KEY NOT NULL,
	"hash" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(256) NOT NULL,
	"name" varchar(256) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "dilemmas" ADD CONSTRAINT "dilemmas_gameId_games_id_fk" FOREIGN KEY ("gameId") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dilemmas" ADD CONSTRAINT "dilemmas_ownerId_users_id_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "players" ADD CONSTRAINT "players_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "players" ADD CONSTRAINT "players_gameId_games_id_fk" FOREIGN KEY ("gameId") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lastKnownStates" ADD CONSTRAINT "lastKnownStates_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lastKnownStates" ADD CONSTRAINT "lastKnownStates_gameId_games_id_fk" FOREIGN KEY ("gameId") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resources" ADD CONSTRAINT "resources_gameId_games_id_fk" FOREIGN KEY ("gameId") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipComponentResourceCosts" ADD CONSTRAINT "shipComponentResourceCosts_shipComponentId_shipComponents_id_fk" FOREIGN KEY ("shipComponentId") REFERENCES "public"."shipComponents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipComponentResourceCosts" ADD CONSTRAINT "shipComponentResourceCosts_resourceId_resources_id_fk" FOREIGN KEY ("resourceId") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipComponents" ADD CONSTRAINT "shipComponents_gameId_games_id_fk" FOREIGN KEY ("gameId") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipComponents" ADD CONSTRAINT "shipComponents_ownerId_users_id_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipDesignComponents" ADD CONSTRAINT "shipDesignComponents_shipDesignId_shipDesigns_id_fk" FOREIGN KEY ("shipDesignId") REFERENCES "public"."shipDesigns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipDesignComponents" ADD CONSTRAINT "shipDesignComponents_shipComponentId_shipComponents_id_fk" FOREIGN KEY ("shipComponentId") REFERENCES "public"."shipComponents"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipDesigns" ADD CONSTRAINT "shipDesigns_gameId_games_id_fk" FOREIGN KEY ("gameId") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipDesigns" ADD CONSTRAINT "shipDesigns_ownerId_users_id_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "starSystemPopulations" ADD CONSTRAINT "starSystemPopulations_starSystemId_starSystems_id_fk" FOREIGN KEY ("starSystemId") REFERENCES "public"."starSystems"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "starSystemPopulations" ADD CONSTRAINT "starSystemPopulations_allegianceToPlayerId_users_id_fk" FOREIGN KEY ("allegianceToPlayerId") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "starSystemResourceDepots" ADD CONSTRAINT "starSystemResourceDepots_starSystemId_starSystems_id_fk" FOREIGN KEY ("starSystemId") REFERENCES "public"."starSystems"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "starSystemResourceDepots" ADD CONSTRAINT "starSystemResourceDepots_resourceId_resources_id_fk" FOREIGN KEY ("resourceId") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "starSystemResourceDiscoveries" ADD CONSTRAINT "starSystemResourceDiscoveries_starSystemId_starSystems_id_fk" FOREIGN KEY ("starSystemId") REFERENCES "public"."starSystems"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "starSystemResourceDiscoveries" ADD CONSTRAINT "starSystemResourceDiscoveries_resourceId_resources_id_fk" FOREIGN KEY ("resourceId") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "starSystems" ADD CONSTRAINT "starSystems_gameId_games_id_fk" FOREIGN KEY ("gameId") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "starSystems" ADD CONSTRAINT "starSystems_ownerId_users_id_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "taskForces" ADD CONSTRAINT "taskForces_gameId_games_id_fk" FOREIGN KEY ("gameId") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "taskForces" ADD CONSTRAINT "taskForces_ownerId_users_id_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "passwords" ADD CONSTRAINT "passwords_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "lastKnownStates_userId_gameId_subjectId_index" ON "lastKnownStates" USING btree ("userId","gameId","subjectId");--> statement-breakpoint
CREATE INDEX "shipDesignComponents_shipDesignId_column_row_index" ON "shipDesignComponents" USING btree ("shipDesignId","column","row");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_index" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users_name_index" ON "users" USING btree ("name");--> statement-breakpoint
CREATE VIEW "public"."shipDesignsWithStats" AS (select "shipDesigns"."id", "shipDesigns"."name", "shipDesigns"."description", "shipDesigns"."decommissioned", jsonb_agg("shipComponents") as "components", sum("shipComponents"."supplyNeedPassive") as "supplyNeedPassive", sum("shipComponents"."supplyNeedMovement") as "supplyNeedMovement", sum("shipComponents"."supplyNeedCombat") as "supplyNeedCombat", sum("shipComponents"."powerNeed") as "powerNeed", sum("shipComponents"."crewNeed") as "crewNeed", sum("shipComponents"."constructionCost") as "constructionCost", sum("shipComponents"."supplyCapacity") as "supplyCapacity", sum("shipComponents"."powerGeneration") as "powerGeneration", sum("shipComponents"."crewCapacity") as "crewCapacity", min("shipComponents"."ftlSpeed") as "ftlSpeed", max("shipComponents"."zoneOfControl") as "zoneOfControl", max("shipComponents"."sensorRange") as "sensorRange", count("shipComponents"."id") as "componentCount", sum("shipComponents"."structuralIntegrity") as "structuralIntegrity" from "shipDesigns" inner join "shipDesignComponents" on "shipDesigns"."id" = "shipDesignComponents"."shipDesignId" inner join "shipComponents" on "shipComponents"."id" = "shipDesignComponents"."shipComponentId" group by "shipDesigns"."id");--> statement-breakpoint
CREATE VIEW "public"."visibility" AS ((select "ownerId" as "userId", "gameId", circle("position", 100) as "circle" from "taskForces" group by "taskForces"."id", "taskForces"."ownerId", "taskForces"."gameId") union all (select "ownerId" as "userId", "gameId", circle("position", 1000) as "circle" from "starSystems" where "starSystems"."ownerId" is not null));