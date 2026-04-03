import {
	Badge,
	Card,
	Group,
	SimpleGrid,
	Stack,
	Text,
	ThemeIcon,
	Title,
} from "@mantine/core";
import {
	IconArrowDown,
	IconFlame,
	IconPick,
	IconSwords,
	IconUsers,
} from "@tabler/icons-react";
import { formatInteger, formatUnit } from "../../../format/formatNumber";
import type { TurnReport, TurnReportSummary } from "../types";
import { StatCard } from "./StatCard";

type ReportSummaryCardProps = {
	report: TurnReport;
	reportIndex: number;
	totalReports: number;
	summary: TurnReportSummary;
};

export function ReportSummaryCard({
	report,
	reportIndex,
	totalReports,
	summary,
}: ReportSummaryCardProps) {
	return (
		<Card withBorder>
			<Group justify="space-between" align="center">
				<Group gap="sm" align="center">
					<ThemeIcon variant="light" color="indigo" size="lg" radius="md">
						<IconFlame size={18} />
					</ThemeIcon>
					<Stack gap={0}>
						<Title order={4}>Turn {report.turnNumber}</Title>
						<Text size="xs" c="dimmed">
							{new Date(report.createdAt).toLocaleString()}
						</Text>
					</Stack>
				</Group>

				<Group gap="xs" align="center">
					<Badge variant="light" color="gray">
						Report {reportIndex} / {totalReports}
					</Badge>
				</Group>
			</Group>

			<SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} mt="md" spacing="sm">
				<StatCard
					title="Population Growth"
					value={`+${formatInteger(summary.totalGrowth)}`}
					detail={`${report.populationChanges.length} systems updated`}
					color="teal"
					icon={<IconUsers size={16} />}
				/>
				<StatCard
					title="Population Migrated"
					value={formatInteger(summary.totalMigrations)}
					detail={`${report.populationMigrations.length} routes active`}
					color="cyan"
					icon={<IconArrowDown size={16} />}
				/>
				<StatCard
					title="Resources Mined"
					value={`+${formatUnit(summary.totalMined)}`}
					detail={`${report.miningChanges.length} extraction entries`}
					color="lime"
					icon={<IconPick size={16} />}
				/>
				<StatCard
					title="Active Engagements"
					value={formatInteger(summary.activeEngagements)}
					detail={`${report.taskForceEngagements.length} total tracked`}
					color={summary.activeEngagements > 0 ? "orange" : "gray"}
					icon={<IconSwords size={16} />}
				/>
			</SimpleGrid>
		</Card>
	);
}
