import { getConnection, getDrizzle } from "@space/data";

const pgConnection = await getConnection();
export const drizzle = getDrizzle(pgConnection);
