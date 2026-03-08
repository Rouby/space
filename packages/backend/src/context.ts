import type { JWTExtendContextFields } from "@graphql-yoga/plugin-jwt";
import type { getDrizzle } from "@space/data";
import { userHasVision } from "@space/data/functions";
import { createGraphQLError, type YogaInitialContext } from "graphql-yoga";
import type { generateUserClaims } from "./config.ts";
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
	claims: Awaited<ReturnType<typeof generateUserClaims>>;
	startGame: (gameId: string) => void;
}) {
	const denyAccess = ({
		message,
		code,
		reason,
		details,
	}: {
		message: string;
		code: "NOT_AUTHORIZED" | "MISSING_CLAIM";
		reason: string;
		details?: Record<string, unknown>;
	}): never => {
		console.warn(
			JSON.stringify({
				event: "security.authorization.denied",
				code,
				reason,
				userId: userId ?? null,
				timestamp: new Date().toISOString(),
				...details,
			}),
		);

		throw createGraphQLError(message, {
			extensions: { code },
		});
	};

	return {
		drizzle,
		userId,
		denyAccess,
		throwWithoutClaim(
			claim: keyof Awaited<ReturnType<typeof generateUserClaims>>,
		): asserts this is { userId: string } {
			if (!userId) {
				denyAccess({
					message: `Missing claim ${claim}`,
					code: "NOT_AUTHORIZED",
					reason: "missing-user-id",
					details: { claim },
				});
			}
			if (!claims[claim]) {
				denyAccess({
					message: `Missing claim ${claim}`,
					code: "MISSING_CLAIM",
					reason: "missing-claim",
					details: { claim },
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
