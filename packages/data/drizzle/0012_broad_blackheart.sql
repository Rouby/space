-- Active: 1730208253342@@127.0.0.1@5433@space@public
CREATE TABLE "taskForceEngagements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"gameId" uuid NOT NULL,
	"taskForceIdA" uuid NOT NULL,
	"taskForceIdB" uuid NOT NULL,
	"ownerIdA" uuid NOT NULL,
	"ownerIdB" uuid NOT NULL,
	"position" "point" NOT NULL,
	"startedAtTurn" integer NOT NULL,
	"resolvedAtTurn" integer,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "taskForceEngagements" ADD CONSTRAINT "taskForceEngagements_gameId_games_id_fk" FOREIGN KEY ("gameId") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "taskForceEngagements" ADD CONSTRAINT "taskForceEngagements_taskForceIdA_taskForces_id_fk" FOREIGN KEY ("taskForceIdA") REFERENCES "public"."taskForces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "taskForceEngagements" ADD CONSTRAINT "taskForceEngagements_taskForceIdB_taskForces_id_fk" FOREIGN KEY ("taskForceIdB") REFERENCES "public"."taskForces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "taskForceEngagements" ADD CONSTRAINT "taskForceEngagements_ownerIdA_users_id_fk" FOREIGN KEY ("ownerIdA") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "taskForceEngagements" ADD CONSTRAINT "taskForceEngagements_ownerIdB_users_id_fk" FOREIGN KEY ("ownerIdB") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "taskForceEngagements_gameId_resolvedAtTurn_index" ON "taskForceEngagements" USING btree ("gameId","resolvedAtTurn");--> statement-breakpoint
CREATE INDEX "taskForceEngagements_gameId_ownerIdA_resolvedAtTurn_index" ON "taskForceEngagements" USING btree ("gameId","ownerIdA","resolvedAtTurn");--> statement-breakpoint
CREATE INDEX "taskForceEngagements_gameId_ownerIdB_resolvedAtTurn_index" ON "taskForceEngagements" USING btree ("gameId","ownerIdB","resolvedAtTurn");
