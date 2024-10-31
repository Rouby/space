import { sql } from "drizzle-orm";
import {
	decimal,
	jsonb,
	pgEnum,
	pgTable,
	primaryKey,
	text,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { games } from "./games.ts";
import { resources } from "./resources.ts";
import { users } from "./users.ts";

export const weaponDeliveryType = pgEnum("weaponDeliveryType", [
	"missile",
	"projectile",
	"beam",
	"instant",
]);

export const shipComponents = pgTable("shipComponents", {
	id: uuid().default(sql`gen_random_uuid()`).primaryKey(),
	gameId: uuid()
		.notNull()
		.references(() => games.id, { onDelete: "cascade" }),
	ownerId: uuid()
		.notNull()
		.references(() => users.id, { onDelete: "restrict" }),
	name: varchar({ length: 256 }).notNull(),
	description: text().notNull(),

	// general stats
	supplyNeedPassive: decimal({ precision: 30, scale: 6 }).notNull(),
	supplyNeedMovement: decimal({ precision: 30, scale: 6 }).notNull(),
	supplyNeedCombat: decimal({ precision: 30, scale: 6 }).notNull(),
	powerNeed: decimal({ precision: 30, scale: 6 }).notNull(),
	crewNeed: decimal({ precision: 30, scale: 6 }).notNull(),
	constructionCost: decimal({ precision: 30, scale: 6 }).notNull(),

	supplyCapacity: decimal({ precision: 30, scale: 6 }),
	powerGeneration: decimal({ precision: 30, scale: 6 }),
	crewCapacity: decimal({ precision: 30, scale: 6 }),

	// strategic stats
	ftlSpeed: decimal({ precision: 30, scale: 6 }),
	zoneOfControl: decimal({ precision: 30, scale: 6 }),
	sensorRange: decimal({ precision: 30, scale: 6 }),

	// tactical stats
	structuralIntegrity: decimal({ precision: 30, scale: 6 }),
	thruster: decimal({ precision: 30, scale: 6 }),
	sensorPrecision: decimal({ precision: 30, scale: 6 }),
	armorThickness: decimal({ precision: 30, scale: 6 }),
	armorEffectivenessAgainst:
		jsonb().$type<
			{
				deliveryType: (typeof weaponDeliveryType.enumValues)[number];
				effectiveness: number;
			}[]
		>(),
	shieldStrength: decimal({ precision: 30, scale: 6 }),
	shieldEffectivenessAgainst:
		jsonb().$type<
			{
				deliveryType: (typeof weaponDeliveryType.enumValues)[number];
				effectiveness: number;
			}[]
		>(),
	weaponDamage: decimal({ precision: 30, scale: 6 }),
	weaponCooldown: decimal({ precision: 30, scale: 6 }),
	weaponRange: decimal({ precision: 30, scale: 6 }),
	weaponArmorPenetration: decimal({ precision: 30, scale: 6 }),
	weaponShieldPenetration: decimal({ precision: 30, scale: 6 }),
	weaponAccuracy: decimal({ precision: 30, scale: 6 }),
	weaponDeliveryType: weaponDeliveryType(),
});

export const shipComponentResourceCosts = pgTable(
	"shipComponentResourceCosts",
	{
		shipComponentId: uuid()
			.notNull()
			.references(() => shipComponents.id, { onDelete: "cascade" }),
		resourceId: uuid()
			.notNull()
			.references(() => resources.id, { onDelete: "cascade" }),
		quantity: decimal({ precision: 30, scale: 6 }).notNull(),
	},
	(table) => ({
		pk: primaryKey({
			columns: [table.shipComponentId, table.resourceId],
		}),
	}),
);
