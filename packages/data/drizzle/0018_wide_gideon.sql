-- Active: 1727998475340@@127.0.0.1@5432@postgres
ALTER TABLE "taskForceResourceNeeds" RENAME TO "taskForceShipCommisionResourceNeeds";--> statement-breakpoint
ALTER TABLE "taskForceShip" RENAME TO "taskForceShips";--> statement-breakpoint
ALTER TABLE "taskForceShipCommisionResourceNeeds" DROP CONSTRAINT "taskForceResourceNeeds_taskForceShipCommisionId_taskForces_id_fk";
--> statement-breakpoint
ALTER TABLE "taskForceShipCommisionResourceNeeds" DROP CONSTRAINT "taskForceResourceNeeds_resourceId_starSystems_id_fk";
--> statement-breakpoint
ALTER TABLE "taskForceShips" DROP CONSTRAINT "taskForceShip_taskForceId_taskForces_id_fk";
--> statement-breakpoint
ALTER TABLE "taskForceShips" DROP CONSTRAINT "taskForceShip_shipDesignId_shipDesigns_id_fk";
--> statement-breakpoint
ALTER TABLE "shipDesignResourceCosts" ALTER COLUMN "quantity" SET DATA TYPE numeric(30, 6);--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "taskForceShipCommisionResourceNeeds" ADD CONSTRAINT "taskForceShipCommisionResourceNeeds_taskForceShipCommisionId_taskForces_id_fk" FOREIGN KEY ("taskForceShipCommisionId") REFERENCES "public"."taskForces"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "taskForceShipCommisionResourceNeeds" ADD CONSTRAINT "taskForceShipCommisionResourceNeeds_resourceId_starSystems_id_fk" FOREIGN KEY ("resourceId") REFERENCES "public"."starSystems"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "taskForceShips" ADD CONSTRAINT "taskForceShips_taskForceId_taskForces_id_fk" FOREIGN KEY ("taskForceId") REFERENCES "public"."taskForces"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "taskForceShips" ADD CONSTRAINT "taskForceShips_shipDesignId_shipDesigns_id_fk" FOREIGN KEY ("shipDesignId") REFERENCES "public"."shipDesigns"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
