ALTER TABLE "taskForceShipCommisionResourceNeeds" DROP CONSTRAINT "taskForceShipCommisionResourceNeeds_taskForceShipCommisionId_taskForces_id_fk";
--> statement-breakpoint
ALTER TABLE "taskForceShipCommisionResourceNeeds" DROP CONSTRAINT "taskForceShipCommisionResourceNeeds_resourceId_starSystems_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "taskForceShipCommisionResourceNeeds" ADD CONSTRAINT "taskForceShipCommisionResourceNeeds_taskForceShipCommisionId_taskForceShipCommisions_id_fk" FOREIGN KEY ("taskForceShipCommisionId") REFERENCES "public"."taskForceShipCommisions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "taskForceShipCommisionResourceNeeds" ADD CONSTRAINT "taskForceShipCommisionResourceNeeds_resourceId_resources_id_fk" FOREIGN KEY ("resourceId") REFERENCES "public"."resources"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
