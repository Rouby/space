import type { starSystems } from "@space/data/schema";

export type VectorMapper = { x: number; y: number };
export type StarSystemMapper = typeof starSystems.$inferSelect;
