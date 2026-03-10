CREATE TABLE "starSystemColonizationPressures" (
	"starSystemId" uuid NOT NULL,
	"gameId" uuid NOT NULL,
	"ownerId" uuid NOT NULL,
	"accumulatedPressure" numeric(20, 6) DEFAULT '0' NOT NULL,
	"pressurePerTurn" numeric(20, 6) DEFAULT '0' NOT NULL,
	CONSTRAINT "starSystemColonizationPressures_starSystemId_ownerId_pk" PRIMARY KEY("starSystemId","ownerId")
);
--> statement-breakpoint
DROP TABLE "starSystemColonizations" CASCADE;--> statement-breakpoint
ALTER TABLE "starSystemColonizationPressures" ADD CONSTRAINT "starSystemColonizationPressures_starSystemId_starSystems_id_fk" FOREIGN KEY ("starSystemId") REFERENCES "public"."starSystems"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "starSystemColonizationPressures" ADD CONSTRAINT "starSystemColonizationPressures_gameId_games_id_fk" FOREIGN KEY ("gameId") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "starSystemColonizationPressures" ADD CONSTRAINT "starSystemColonizationPressures_ownerId_users_id_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;