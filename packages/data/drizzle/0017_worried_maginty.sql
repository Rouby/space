CREATE TABLE "taskForceShipDesigns" (
	"taskForceId" uuid NOT NULL,
	"shipDesignId" uuid NOT NULL,
	CONSTRAINT "taskForceShipDesigns_taskForceId_shipDesignId_pk" PRIMARY KEY("taskForceId","shipDesignId")
);
--> statement-breakpoint
ALTER TABLE "taskForceShipDesigns" ADD CONSTRAINT "taskForceShipDesigns_taskForceId_taskForces_id_fk" FOREIGN KEY ("taskForceId") REFERENCES "public"."taskForces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "taskForceShipDesigns" ADD CONSTRAINT "taskForceShipDesigns_shipDesignId_shipDesigns_id_fk" FOREIGN KEY ("shipDesignId") REFERENCES "public"."shipDesigns"("id") ON DELETE restrict ON UPDATE no action;