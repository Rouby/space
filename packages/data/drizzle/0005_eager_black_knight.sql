ALTER TABLE "taskForces" RENAME COLUMN "userId" TO "ownerId";--> statement-breakpoint
ALTER TABLE "taskForces" DROP CONSTRAINT "taskForces_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "setupCompleted" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "starSystems" ADD COLUMN "ownerId" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "starSystems" ADD CONSTRAINT "starSystems_ownerId_users_id_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "taskForces" ADD CONSTRAINT "taskForces_ownerId_users_id_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
