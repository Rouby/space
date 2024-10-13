import type {
	starSystemResourceDepots,
	starSystemResourceDiscoveries,
	starSystems,
} from "@space/data/schema";

export type VectorMapper = { x: number; y: number };
export type StarSystemMapper = typeof starSystems.$inferSelect;
export type ResourceDiscoveryMapper =
	typeof starSystemResourceDiscoveries.$inferSelect;
export type ResourceDepotMapper = typeof starSystemResourceDepots.$inferSelect;
