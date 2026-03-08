ALTER TABLE "taskForces" ADD COLUMN "constructionStarSystemId" uuid;--> statement-breakpoint
ALTER TABLE "taskForces" ADD COLUMN "constructionDone" numeric(30, 6);--> statement-breakpoint
ALTER TABLE "taskForces" ADD COLUMN "constructionTotal" numeric(30, 6);--> statement-breakpoint
ALTER TABLE "taskForces" ADD COLUMN "constructionPerTick" numeric(30, 6);--> statement-breakpoint
ALTER TABLE "taskForces" ADD CONSTRAINT "taskForces_constructionStarSystemId_starSystems_id_fk" FOREIGN KEY ("constructionStarSystemId") REFERENCES "public"."starSystems"("id") ON DELETE set null ON UPDATE no action;