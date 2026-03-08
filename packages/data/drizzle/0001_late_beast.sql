CREATE TABLE "turnReports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"gameId" uuid NOT NULL,
	"turnNumber" integer NOT NULL,
	"summary" jsonb NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "turnReports" ADD CONSTRAINT "turnReports_gameId_games_id_fk" FOREIGN KEY ("gameId") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "turnReports_gameId_turnNumber_index" ON "turnReports" USING btree ("gameId","turnNumber");--> statement-breakpoint
CREATE INDEX "turnReports_gameId_createdAt_index" ON "turnReports" USING btree ("gameId","createdAt");