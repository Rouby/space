import type { JWTExtendContextFields } from "@graphql-yoga/plugin-jwt";
import type { getDrizzle } from "@space/data";
import { type YogaInitialContext, createGraphQLError } from "graphql-yoga";

export type Context = YogaInitialContext & {
	jwt?: JWTExtendContextFields;
} & ReturnType<typeof extendContext>;

export function extendContext({
	drizzle,
	userId,
	claims,
}: {
	drizzle: Awaited<ReturnType<typeof getDrizzle>>;
	userId?: string;
	claims: Record<string, unknown>;
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
	};
}
