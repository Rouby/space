import type { getDrizzle } from "../index.ts";
import { and, eq, sql, visibility } from "../schema.ts";

type FirstArgument<T> = T extends (arg: infer U) => unknown ? U : never;
export async function userIdsWithVision(
	db:
		| ReturnType<typeof getDrizzle>
		| FirstArgument<
				FirstArgument<ReturnType<typeof getDrizzle>["transaction"]>
		  >,
	gameId: string,
	point: { x: number; y: number },
) {
	const users = await db
		.selectDistinctOn([visibility.userId], { userId: visibility.userId })
		.from(visibility)
		.where(
			and(
				eq(visibility.gameId, gameId),
				sql`${visibility.circle} @> point(${point.x},${point.y})`,
			),
		);

	return users.map((user) => user.userId);
}
