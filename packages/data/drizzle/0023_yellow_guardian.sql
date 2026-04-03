ALTER TABLE "taskForceShipDesigns" DROP CONSTRAINT "taskForceShipDesigns_shipDesignId_shipDesigns_id_fk";
--> statement-breakpoint
ALTER TABLE "taskForceShipDesigns" ADD CONSTRAINT "taskForceShipDesigns_shipDesignId_shipDesigns_id_fk" FOREIGN KEY ("shipDesignId") REFERENCES "public"."shipDesigns"("id") ON DELETE cascade ON UPDATE no action;