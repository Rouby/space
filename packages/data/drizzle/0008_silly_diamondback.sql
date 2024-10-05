ALTER TABLE "taskForces" ALTER COLUMN "orders" SET DEFAULT '[]'::json;--> statement-breakpoint
ALTER TABLE "taskForces" ADD COLUMN "movementVector" "point";