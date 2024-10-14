import type { shipDesigns } from "@space/data/schema";

export type ShipDesignMapper = typeof shipDesigns.$inferSelect;
export type ResourceCostMapper = { resourceId: string; quantity: number };
