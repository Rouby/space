import type { TurnReportsDetailsQuery } from "../../gql/graphql";

export type TurnReport = TurnReportsDetailsQuery["game"]["turnReports"][number];

export type TurnReportSummary = {
	totalGrowth: number;
	totalMigrations: number;
	totalMined: number;
	activeEngagements: number;
};
