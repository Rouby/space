CREATE TABLE "playerColonizationGovernances" (
	"gameId" uuid NOT NULL,
	"ownerId" uuid NOT NULL,
	"starSystemId" uuid NOT NULL,
	"governance" varchar(16) NOT NULL,
	CONSTRAINT "playerColonizationGovernances_gameId_ownerId_starSystemId_pk" PRIMARY KEY("gameId","ownerId","starSystemId")
);
--> statement-breakpoint
ALTER TABLE "playerColonizationGovernances" ADD CONSTRAINT "playerColonizationGovernances_gameId_games_id_fk" FOREIGN KEY ("gameId") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playerColonizationGovernances" ADD CONSTRAINT "playerColonizationGovernances_ownerId_users_id_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playerColonizationGovernances" ADD CONSTRAINT "playerColonizationGovernances_starSystemId_starSystems_id_fk" FOREIGN KEY ("starSystemId") REFERENCES "public"."starSystems"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "playerColonizationGovernances_gameId_ownerId_index" ON "playerColonizationGovernances" USING btree ("gameId","ownerId");--> statement-breakpoint
CREATE INDEX "playerColonizationGovernances_gameId_starSystemId_index" ON "playerColonizationGovernances" USING btree ("gameId","starSystemId");