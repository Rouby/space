import type { JWTExtendContextFields } from "@graphql-yoga/plugin-jwt";
import type { getDrizzle } from "@space/data";
import { userHasVision } from "@space/data/functions";
import { type YogaInitialContext, createGraphQLError } from "graphql-yoga";
import { fromGameEvents } from "./workers.ts";

export type Context = YogaInitialContext & {
	jwt?: JWTExtendContextFields;
} & ReturnType<typeof extendContext>;

export function extendContext({
	drizzle,
	userId,
	claims,
	startGame,
}: {
	drizzle: Awaited<ReturnType<typeof getDrizzle>>;
	userId?: string;
	claims: Record<string, unknown>;
	startGame: (gameId: string) => void;
}) {
	return {
		drizzle,
		userId,
		throwWithoutClaim(claim: string) {
			if (!userId) {
				throw createGraphQLError(`Missing claim ${claim}`, {
					extensions: { code: "NOT_AUTHORIZED" },
				});
			}
			if (!claims[claim]) {
				throw createGraphQLError(`Missing claim ${claim}`, {
					extensions: { code: "MISSING_CLAIM" },
				});
			}
		},
		startGame,
		fromGameEvents,

		hasVision: async (gameId: string, point: { x: number; y: number }) => {
			if (!userId) {
				return false;
			}
			return userHasVision(drizzle, gameId, userId, point);
		},
	};
}
