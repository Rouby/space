CREATE TABLE "starSystemIndustrialProjects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"gameId" uuid NOT NULL,
	"starSystemId" uuid NOT NULL,
	"playerId" uuid NOT NULL,
	"projectType" varchar(64) NOT NULL,
	"industryPerTurn" integer NOT NULL,
	"workRequired" integer NOT NULL,
	"workDone" integer DEFAULT 0 NOT NULL,
	"completionIndustryBonus" integer NOT NULL,
	"queuePosition" integer NOT NULL,
	"queuedAtTurn" integer NOT NULL,
	"startedAtTurn" integer,
	"completedAtTurn" integer,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "starSystemIndustrialProjects" ADD CONSTRAINT "starSystemIndustrialProjects_gameId_games_id_fk" FOREIGN KEY ("gameId") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "starSystemIndustrialProjects" ADD CONSTRAINT "starSystemIndustrialProjects_starSystemId_starSystems_id_fk" FOREIGN KEY ("starSystemId") REFERENCES "public"."starSystems"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "starSystemIndustrialProjects" ADD CONSTRAINT "starSystemIndustrialProjects_playerId_users_id_fk" FOREIGN KEY ("playerId") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "starSystemIndustrialProjects_gameId_starSystemId_queuePosition_index" ON "starSystemIndustrialProjects" USING btree ("gameId","starSystemId","queuePosition");--> statement-breakpoint
CREATE INDEX "starSystemIndustrialProjects_gameId_starSystemId_completedAtTurn_index" ON "starSystemIndustrialProjects" USING btree ("gameId","starSystemId","completedAtTurn");--> statement-breakpoint
CREATE INDEX "starSystemIndustrialProjects_playerId_queuedAtTurn_index" ON "starSystemIndustrialProjects" USING btree ("playerId","queuedAtTurn");