import type { games, players, users } from "@space/data/schema";

export type GameMapper = typeof games.$inferSelect;
export type PlayerMapper = typeof players.$inferSelect & {
	user: typeof users.$inferSelect;
};
