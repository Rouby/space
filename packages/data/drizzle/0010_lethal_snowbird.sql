CREATE TABLE "starSystemDevelopmentStances" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"gameId" uuid NOT NULL,
	"starSystemId" uuid NOT NULL,
	"playerId" uuid NOT NULL,
	"turnNumber" integer NOT NULL,
	"stance" varchar(32) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "starSystemDevelopmentStances" ADD CONSTRAINT "starSystemDevelopmentStances_gameId_games_id_fk" FOREIGN KEY ("gameId") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "starSystemDevelopmentStances" ADD CONSTRAINT "starSystemDevelopmentStances_starSystemId_starSystems_id_fk" FOREIGN KEY ("starSystemId") REFERENCES "public"."starSystems"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "starSystemDevelopmentStances" ADD CONSTRAINT "starSystemDevelopmentStances_playerId_users_id_fk" FOREIGN KEY ("playerId") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "starSystemDevelopmentStances_gameId_starSystemId_turnNumber_index" ON "starSystemDevelopmentStances" USING btree ("gameId","starSystemId","turnNumber");--> statement-breakpoint
CREATE INDEX "starSystemDevelopmentStances_gameId_turnNumber_index" ON "starSystemDevelopmentStances" USING btree ("gameId","turnNumber");--> statement-breakpoint
CREATE INDEX "starSystemDevelopmentStances_playerId_turnNumber_index" ON "starSystemDevelopmentStances" USING btree ("playerId","turnNumber");