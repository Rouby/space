ALTER TABLE "starSystemIndustrialProjects" ADD COLUMN "maintenanceCost" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "starSystems" ADD COLUMN "populationGrowthBonus" numeric(10, 6) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "starSystems" ADD COLUMN "constructionCostModifier" numeric(10, 6) DEFAULT '0' NOT NULL;