import type { getDrizzle } from "@space/data";
import type { YogaInitialContext } from "graphql-yoga";

export type Context = YogaInitialContext & {
	drizzle: Awaited<ReturnType<typeof getDrizzle>>;
};
