ALTER TABLE "games" ADD COLUMN "hostUserId" uuid;--> statement-breakpoint
UPDATE "games" AS "g"
SET "hostUserId" = "p"."userId"
FROM (
	SELECT "players"."gameId", min("players"."userId") AS "userId"
	FROM "players"
	GROUP BY "players"."gameId"
) AS "p"
WHERE "g"."id" = "p"."gameId"
	AND "g"."hostUserId" IS NULL;--> statement-breakpoint
UPDATE "games"
SET "hostUserId" = (
	SELECT "users"."id"
	FROM "users"
	ORDER BY "users"."id"
	LIMIT 1
)
WHERE "hostUserId" IS NULL;--> statement-breakpoint
ALTER TABLE "games" ALTER COLUMN "hostUserId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_hostUserId_users_id_fk" FOREIGN KEY ("hostUserId") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;