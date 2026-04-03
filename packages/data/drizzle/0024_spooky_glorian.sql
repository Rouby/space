CREATE TABLE "playerResearchDirectives" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"gameId" uuid NOT NULL,
	"playerId" uuid NOT NULL,
	"turnNumber" integer NOT NULL,
	"primaryCategory" varchar(32) NOT NULL,
	"secondaryCategory" varchar(32) NOT NULL,
	"methodology" varchar(32) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "playerResearchOutcomes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"gameId" uuid NOT NULL,
	"playerId" uuid NOT NULL,
	"category" varchar(32) NOT NULL,
	"turnNumber" integer NOT NULL,
	"outcomeKey" varchar(128) NOT NULL,
	"outcomeMode" varchar(32) NOT NULL,
	"stat" varchar(64) NOT NULL,
	"modifier" numeric(10, 6) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "playerResearchStates" (
	"gameId" uuid NOT NULL,
	"playerId" uuid NOT NULL,
	"category" varchar(32) NOT NULL,
	"breakthroughCount" integer DEFAULT 0 NOT NULL,
	"phase" varchar(16) DEFAULT 'hypothesis' NOT NULL,
	"cumulativeMomentum" numeric(18, 6) DEFAULT '0' NOT NULL,
	"recentEvidence" numeric(18, 6) DEFAULT '0' NOT NULL,
	"synthesisProgress" numeric(18, 6) DEFAULT '0' NOT NULL,
	"consecutivePrimary" integer DEFAULT 0 NOT NULL,
	"lastUpdatedTurn" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "playerResearchStates_gameId_playerId_category_pk" PRIMARY KEY("gameId","playerId","category")
);
--> statement-breakpoint
ALTER TABLE "playerResearchDirectives" ADD CONSTRAINT "playerResearchDirectives_gameId_games_id_fk" FOREIGN KEY ("gameId") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playerResearchDirectives" ADD CONSTRAINT "playerResearchDirectives_playerId_users_id_fk" FOREIGN KEY ("playerId") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playerResearchOutcomes" ADD CONSTRAINT "playerResearchOutcomes_gameId_games_id_fk" FOREIGN KEY ("gameId") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playerResearchOutcomes" ADD CONSTRAINT "playerResearchOutcomes_playerId_users_id_fk" FOREIGN KEY ("playerId") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playerResearchStates" ADD CONSTRAINT "playerResearchStates_gameId_games_id_fk" FOREIGN KEY ("gameId") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playerResearchStates" ADD CONSTRAINT "playerResearchStates_playerId_users_id_fk" FOREIGN KEY ("playerId") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "playerResearchDirectives_gameId_playerId_turnNumber_index" ON "playerResearchDirectives" USING btree ("gameId","playerId","turnNumber");--> statement-breakpoint
CREATE INDEX "playerResearchDirectives_gameId_turnNumber_index" ON "playerResearchDirectives" USING btree ("gameId","turnNumber");--> statement-breakpoint
CREATE INDEX "playerResearchDirectives_playerId_turnNumber_index" ON "playerResearchDirectives" USING btree ("playerId","turnNumber");--> statement-breakpoint
CREATE INDEX "playerResearchOutcomes_gameId_playerId_turnNumber_index" ON "playerResearchOutcomes" USING btree ("gameId","playerId","turnNumber");--> statement-breakpoint
CREATE INDEX "playerResearchOutcomes_gameId_playerId_category_index" ON "playerResearchOutcomes" USING btree ("gameId","playerId","category");--> statement-breakpoint
CREATE INDEX "playerResearchStates_gameId_playerId_index" ON "playerResearchStates" USING btree ("gameId","playerId");--> statement-breakpoint
CREATE INDEX "playerResearchStates_gameId_category_index" ON "playerResearchStates" USING btree ("gameId","category");