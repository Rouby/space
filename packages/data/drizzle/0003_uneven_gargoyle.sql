CREATE TABLE "starSystemColonizations" (
	"starSystemId" uuid NOT NULL,
	"gameId" uuid NOT NULL,
	"playerId" uuid NOT NULL,
	"originStarSystemId" uuid NOT NULL,
	"turnsRequired" integer NOT NULL,
	"startedAtTurn" integer NOT NULL,
	"dueTurn" integer NOT NULL,
	"startedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "starSystemColonizations_starSystemId_pk" PRIMARY KEY("starSystemId")
);
--> statement-breakpoint
ALTER TABLE "starSystemColonizations" ADD CONSTRAINT "starSystemColonizations_starSystemId_starSystems_id_fk" FOREIGN KEY ("starSystemId") REFERENCES "public"."starSystems"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "starSystemColonizations" ADD CONSTRAINT "starSystemColonizations_gameId_games_id_fk" FOREIGN KEY ("gameId") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "starSystemColonizations" ADD CONSTRAINT "starSystemColonizations_playerId_users_id_fk" FOREIGN KEY ("playerId") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "starSystemColonizations" ADD CONSTRAINT "starSystemColonizations_originStarSystemId_starSystems_id_fk" FOREIGN KEY ("originStarSystemId") REFERENCES "public"."starSystems"("id") ON DELETE restrict ON UPDATE no action;