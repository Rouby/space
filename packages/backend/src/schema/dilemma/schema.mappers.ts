import type { dilemmas } from "@space/data/schema";
import type { VectorMapper } from "../base/schema.mappers.ts";

export type DilemmaMapper = typeof dilemmas.$inferSelect & {
	position: VectorMapper | null;
};
