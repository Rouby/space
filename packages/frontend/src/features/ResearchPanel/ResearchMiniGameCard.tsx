import {
	Alert,
	Badge,
	Button,
	Card,
	Group,
	Stack,
	Text,
	ThemeIcon,
} from "@mantine/core";
import { IconFlask2 } from "@tabler/icons-react";
import type { CombinedError } from "urql";
import { ResearchMiniGameType } from "../../gql/graphql";
import { BreakthroughIncidentMiniGame } from "./BreakthroughIncident/BreakthroughIncidentMiniGame";
import { EvidenceTriangulationMiniGame } from "./EvidenceTriangulation/EvidenceTriangulationMiniGame";
import {
	categoryMeta,
	type ResearchMiniGamePromptData,
} from "./ResearchPanel.shared";

type ResearchMiniGameCardProps = {
	prompt: ResearchMiniGamePromptData | null | undefined;
	triangulationSupportCardId: string;
	triangulationConflictCardId: string;
	triangulationControlCardId: string;
	incidentStepOneRisky: boolean;
	incidentStepTwoRisky: boolean;
	incidentStepThreeRisky: boolean;
	submitError?: CombinedError;
	isSubmitting: boolean;
	onTriangulationSupportCardIdChange: (value: string) => void;
	onTriangulationConflictCardIdChange: (value: string) => void;
	onTriangulationControlCardIdChange: (value: string) => void;
	onIncidentStepOneRiskyChange: (value: boolean) => void;
	onIncidentStepTwoRiskyChange: (value: boolean) => void;
	onIncidentStepThreeRiskyChange: (value: boolean) => void;
	onSubmit: () => Promise<void>;
};

export function ResearchMiniGameCard({
	prompt,
	triangulationSupportCardId,
	triangulationConflictCardId,
	triangulationControlCardId,
	incidentStepOneRisky,
	incidentStepTwoRisky,
	incidentStepThreeRisky,
	submitError,
	isSubmitting,
	onTriangulationSupportCardIdChange,
	onTriangulationConflictCardIdChange,
	onTriangulationControlCardIdChange,
	onIncidentStepOneRiskyChange,
	onIncidentStepTwoRiskyChange,
	onIncidentStepThreeRiskyChange,
	onSubmit,
}: ResearchMiniGameCardProps) {
	const isSubmitted = prompt?.submitted ?? false;
	const hasDistinctTriangulationSelection =
		new Set([
			triangulationSupportCardId,
			triangulationConflictCardId,
			triangulationControlCardId,
		]).size >= 3;

	return (
		<Card
			withBorder
			style={{ overflow: "visible", position: "relative", zIndex: 0 }}
		>
			<Stack gap="sm" style={{ overflow: "visible" }}>
				<Group justify="space-between" align="center">
					<Group gap="xs">
						<ThemeIcon color="teal" variant="light" size="md">
							<IconFlask2 size={14} />
						</ThemeIcon>
						<Text fw={600}>Research Operation</Text>
					</Group>
					{prompt ? (
						<Badge variant="light" color="teal">
							{prompt.miniGameType ===
							ResearchMiniGameType.EvidenceTriangulation
								? "Triangulation Protocol"
								: "Critical Incident"}
						</Badge>
					) : null}
				</Group>

				{prompt ? (
					<>
						<Text size="sm" c="dimmed">
							{prompt.promptDescription}
						</Text>

						<Badge
							variant="dot"
							color={categoryMeta[prompt.targetCategory].color}
						>
							Target {categoryMeta[prompt.targetCategory].label}
						</Badge>

						{!isSubmitted ? (
							prompt.miniGameType ===
							ResearchMiniGameType.EvidenceTriangulation ? (
								<EvidenceTriangulationMiniGame
									prompt={prompt}
									triangulationSupportCardId={triangulationSupportCardId}
									triangulationConflictCardId={triangulationConflictCardId}
									triangulationControlCardId={triangulationControlCardId}
									onTriangulationSupportCardIdChange={
										onTriangulationSupportCardIdChange
									}
									onTriangulationConflictCardIdChange={
										onTriangulationConflictCardIdChange
									}
									onTriangulationControlCardIdChange={
										onTriangulationControlCardIdChange
									}
								/>
							) : (
								<BreakthroughIncidentMiniGame
									prompt={prompt}
									incidentStepOneRisky={incidentStepOneRisky}
									incidentStepTwoRisky={incidentStepTwoRisky}
									incidentStepThreeRisky={incidentStepThreeRisky}
									onIncidentStepOneRiskyChange={onIncidentStepOneRiskyChange}
									onIncidentStepTwoRiskyChange={onIncidentStepTwoRiskyChange}
									onIncidentStepThreeRiskyChange={
										onIncidentStepThreeRiskyChange
									}
								/>
							)
						) : null}

						{submitError ? (
							<Alert color="red" title="Could not dispatch research order">
								{submitError.message}
							</Alert>
						) : null}

						{prompt.submitted ? (
							<Alert
								color="teal"
								title="Research order dispatched"
								variant="light"
							>
								Projected momentum gain{" "}
								{(prompt.submittedBonus ?? 0).toFixed(2)} | Evidence quality{" "}
								{Math.round((prompt.submittedQualityScore ?? 0) * 100)} |
								Confidence{" "}
								{Math.round((prompt.submittedConfidenceScore ?? 0) * 100)}
							</Alert>
						) : null}

						{!isSubmitted ? (
							<Button
								onClick={onSubmit}
								loading={isSubmitting}
								disabled={
									prompt.miniGameType ===
										ResearchMiniGameType.EvidenceTriangulation &&
									!hasDistinctTriangulationSelection
								}
							>
								Dispatch research order
							</Button>
						) : null}
					</>
				) : (
					<Text size="sm" c="dimmed">
						Operation briefing will appear after research channels stabilize.
					</Text>
				)}
			</Stack>
		</Card>
	);
}
