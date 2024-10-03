import type { games, players } from "@space/data/schema";

export type GameMapper = typeof games.$inferSelect;
export type PlayerMapper = typeof players.$inferSelect;
