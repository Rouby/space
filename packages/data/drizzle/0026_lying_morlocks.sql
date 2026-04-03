CREATE TABLE "playerColonizationPressureAllocations" (
	"gameId" uuid NOT NULL,
	"ownerId" uuid NOT NULL,
	"targetStarSystemId" uuid NOT NULL,
	"sourceStarSystemId" uuid NOT NULL,
	"industryCommitted" integer NOT NULL,
	CONSTRAINT "playerColonizationPressureAllocations_pk" PRIMARY KEY("gameId","ownerId","targetStarSystemId","sourceStarSystemId")
);
--> statement-breakpoint
ALTER TABLE "playerColonizationPressureAllocations" ADD CONSTRAINT "playerColonizationPressureAllocations_gameId_games_id_fk" FOREIGN KEY ("gameId") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playerColonizationPressureAllocations" ADD CONSTRAINT "playerColonizationPressureAllocations_ownerId_users_id_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playerColonizationPressureAllocations" ADD CONSTRAINT "playerColonizationPressureAllocations_targetStarSystemId_starSystems_id_fk" FOREIGN KEY ("targetStarSystemId") REFERENCES "public"."starSystems"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playerColonizationPressureAllocations" ADD CONSTRAINT "playerColonizationPressureAllocations_sourceStarSystemId_starSystems_id_fk" FOREIGN KEY ("sourceStarSystemId") REFERENCES "public"."starSystems"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "playerColPressureAlloc_target_idx" ON "playerColonizationPressureAllocations" USING btree ("gameId","ownerId","targetStarSystemId");--> statement-breakpoint
CREATE INDEX "playerColPressureAlloc_source_idx" ON "playerColonizationPressureAllocations" USING btree ("gameId","ownerId","sourceStarSystemId");--> statement-breakpoint
CREATE INDEX "playerColPressureAlloc_game_target_idx" ON "playerColonizationPressureAllocations" USING btree ("gameId","targetStarSystemId");
