import {
	Accordion,
	Card,
	Group,
	Pagination,
	ScrollArea,
	Stack,
	Text,
	Title,
} from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import { useParams } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "urql";
import { graphql } from "../../gql";
import { EconomySection } from "./components/EconomySection";
import { MilitarySection } from "./components/MilitarySection";
import { PopulationSection } from "./components/PopulationSection";
import { ReportSummaryCard } from "./components/ReportSummaryCard";
import { ResearchColonizationSection } from "./components/ResearchColonizationSection";
import type { TurnReportSummary } from "./types";

export function TurnReportsDetails() {
	const { id: gameId } = useParams({ from: "/games/_authenticated/$id" });

	const [{ data }] = useQuery({
		query: graphql(`
			query TurnReportsDetails($gameId: ID!) {
				game(id: $gameId) {
					id
					turnReports(limit: 40) {
						id
						turnNumber
						createdAt
						populationChanges {
							starSystem {
								id
								name
							}
							population {
								id
							}
							previousAmount
							newAmount
							growth
						}
						populationMigrations {
							sourceStarSystem {
								id
								name
							}
							destinationStarSystem {
								id
								name
							}
							allegiancePlayer {
								id
								name
							}
							amount
						}
						miningChanges {
							starSystem {
								id
								name
							}
							resource {
								id
								name
							}
							mined
							remainingDeposits
							depotQuantity
						}
						industryChanges {
							starSystem {
								id
								name
							}
							industryTotal
							industryUtilized
						}
						industrialProjectCompletions {
							starSystem {
								id
								name
							}
							projectType
							industryBonus
						}
						taskForceConstructionChanges {
							taskForce {
								id
								name
							}
							starSystem {
								id
								name
							}
							previousDone
							newDone
							total
							perTick
							completed
						}
						taskForceEngagements {
							engagementId
							status
							taskForceAId
							taskForceBId
							taskForceAName
							taskForceBName
							winnerTaskForceId
							location
						}
						colonizationPressureChanges {
							starSystem {
								id
								name
							}
							pressureAdded
							accumulatedPressure
							pressureThreshold
						}
						colonizationCompleted {
							starSystem {
								id
								name
							}
							accumulatedPressure
							pressureThreshold
						}
						researchProgressChanges {
							category
							momentumGained
							totalMomentum
							phase
							phaseChanged
						}
						researchBreakthroughs {
							category
							outcomeKey
							outcomeMode
							stat
							modifier
						}
					}
				}
			}
		`),
		variables: { gameId },
	});

	const reports = data?.game.turnReports ?? [];
	const [activePage, setActivePage] = useState(1);

	const validPage =
		reports.length > 0 ? Math.min(activePage, reports.length) : 1;
	const report = reports[validPage - 1];

	const goToPreviousReport = () => {
		if (reports.length <= 1) {
			return;
		}
		setActivePage((current) => Math.max(1, current - 1));
	};

	const goToNextReport = () => {
		if (reports.length <= 1) {
			return;
		}
		setActivePage((current) => Math.min(reports.length, current + 1));
	};

	useHotkeys([
		["ArrowLeft", goToPreviousReport],
		["ArrowRight", goToNextReport],
	]);

	const summary = useMemo<TurnReportSummary | null>(() => {
		if (!report) {
			return null;
		}

		const totalGrowth = report.populationChanges.reduce(
			(total, change) => total + change.growth,
			0,
		);
		const totalMigrations = report.populationMigrations.reduce(
			(total, migration) => total + migration.amount,
			0,
		);
		const totalMined = report.miningChanges.reduce(
			(total, change) => total + change.mined,
			0,
		);
		const activeEngagements = report.taskForceEngagements.filter(
			(engagement) => engagement.status !== "resolved",
		).length;

		return {
			totalGrowth,
			totalMigrations,
			totalMined,
			activeEngagements,
		};
	}, [report]);

	return (
		<Stack p="md" gap="md" h="100%" mah="100%" style={{ overflow: "hidden" }}>
			<Group justify="space-between" align="flex-start">
				<Stack gap={2}>
					<Title order={3}>Turn Reports</Title>
					<Text size="sm" c="dimmed">
						End-of-turn intelligence for empire growth, production, military
						pressure, and research momentum.
					</Text>
					{reports.length > 1 ? (
						<Text size="xs" c="dimmed">
							Use Left and Right Arrow keys to move between reports.
						</Text>
					) : null}
				</Stack>
				{reports.length > 1 ? (
					<Pagination
						total={reports.length}
						value={validPage}
						onChange={setActivePage}
						size="sm"
						withEdges
					/>
				) : null}
			</Group>

			{reports.length === 0 || !report || !summary ? (
				<Card withBorder>
					<Text>No reports available yet. End a turn to generate one.</Text>
				</Card>
			) : (
				<ScrollArea h="100%" type="always">
					<Stack gap="sm" pr="sm">
						<ReportSummaryCard
							report={report}
							reportIndex={validPage}
							totalReports={reports.length}
							summary={summary}
						/>

						<Accordion
							variant="contained"
							radius="md"
							defaultValue={["population", "economy"]}
							multiple
						>
							<PopulationSection report={report} />
							<EconomySection report={report} />
							<MilitarySection report={report} gameId={gameId} />
							<ResearchColonizationSection report={report} />
						</Accordion>
					</Stack>
				</ScrollArea>
			)}
		</Stack>
	);
}
