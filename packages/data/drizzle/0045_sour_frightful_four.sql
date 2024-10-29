ALTER TABLE "shipComponentResourceCosts" DROP CONSTRAINT "shipComponentResourceCosts_resourceId_resources_id_fk";
--> statement-breakpoint
ALTER TABLE "shipDesignResourceCosts" DROP CONSTRAINT "shipDesignResourceCosts_resourceId_resources_id_fk";
--> statement-breakpoint
ALTER TABLE "starSystemResourceDepots" DROP CONSTRAINT "starSystemResourceDepots_resourceId_resources_id_fk";
--> statement-breakpoint
ALTER TABLE "starSystemResourceDiscoveries" DROP CONSTRAINT "starSystemResourceDiscoveries_resourceId_resources_id_fk";
--> statement-breakpoint
ALTER TABLE "taskForceShipCommisionResourceNeeds" DROP CONSTRAINT "taskForceShipCommisionResourceNeeds_resourceId_resources_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shipComponentResourceCosts" ADD CONSTRAINT "shipComponentResourceCosts_resourceId_resources_id_fk" FOREIGN KEY ("resourceId") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shipDesignResourceCosts" ADD CONSTRAINT "shipDesignResourceCosts_resourceId_resources_id_fk" FOREIGN KEY ("resourceId") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "starSystemResourceDepots" ADD CONSTRAINT "starSystemResourceDepots_resourceId_resources_id_fk" FOREIGN KEY ("resourceId") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "starSystemResourceDiscoveries" ADD CONSTRAINT "starSystemResourceDiscoveries_resourceId_resources_id_fk" FOREIGN KEY ("resourceId") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "taskForceShipCommisionResourceNeeds" ADD CONSTRAINT "taskForceShipCommisionResourceNeeds_resourceId_resources_id_fk" FOREIGN KEY ("resourceId") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
