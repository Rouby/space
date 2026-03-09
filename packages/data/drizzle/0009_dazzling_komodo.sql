DROP INDEX "turnReports_gameId_createdAt_index";--> statement-breakpoint
TRUNCATE TABLE "turnReports";--> statement-breakpoint
ALTER TABLE "turnReports" ADD COLUMN "ownerId" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "turnReports" ADD CONSTRAINT "turnReports_ownerId_users_id_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "turnReports_gameId_ownerId_index" ON "turnReports" USING btree ("gameId","ownerId");--> statement-breakpoint
CREATE INDEX "turnReports_ownerId_turnNumber_index" ON "turnReports" USING btree ("ownerId","turnNumber");