ALTER TABLE "shipDesignComponents" DROP CONSTRAINT "shipDesignComponents_shipComponentId_shipComponents_id_fk";
--> statement-breakpoint
ALTER TABLE "shipDesignComponents" ADD CONSTRAINT "shipDesignComponents_shipComponentId_shipComponents_id_fk" FOREIGN KEY ("shipComponentId") REFERENCES "public"."shipComponents"("id") ON DELETE cascade ON UPDATE no action;