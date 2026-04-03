CREATE TABLE "playerResearchMiniGameActions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"gameId" uuid NOT NULL,
	"playerId" uuid NOT NULL,
	"turnNumber" integer NOT NULL,
	"miniGameType" varchar(64) NOT NULL,
	"targetCategory" varchar(32) NOT NULL,
	"promptSeed" integer NOT NULL,
	"qualityScore" numeric(10, 6) NOT NULL,
	"confidenceScore" numeric(10, 6) NOT NULL,
	"bonus" numeric(10, 6) NOT NULL,
	"riskTag" varchar(16) NOT NULL,
	"actionSummary" jsonb NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "playerResearchMiniGameActions" ADD CONSTRAINT "playerResearchMiniGameActions_gameId_games_id_fk" FOREIGN KEY ("gameId") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playerResearchMiniGameActions" ADD CONSTRAINT "playerResearchMiniGameActions_playerId_users_id_fk" FOREIGN KEY ("playerId") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "playerResearchMiniGameActions_gameId_playerId_turnNumber_index" ON "playerResearchMiniGameActions" USING btree ("gameId","playerId","turnNumber");--> statement-breakpoint
CREATE INDEX "playerResearchMiniGameActions_gameId_turnNumber_index" ON "playerResearchMiniGameActions" USING btree ("gameId","turnNumber");--> statement-breakpoint
CREATE INDEX "playerResearchMiniGameActions_gameId_playerId_targetCategory_index" ON "playerResearchMiniGameActions" USING btree ("gameId","playerId","targetCategory");
