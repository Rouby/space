import {
	Alert,
	Badge,
	Group,
	List,
	Progress,
	Stack,
	Text,
} from "@mantine/core";
import { IconSparkles } from "@tabler/icons-react";
import { DetailsModal } from "../../components/DetailsModal/DetailsModal";
import type { ResearchCategory, ResearchMethodology } from "../../gql/graphql";
import {
	buildEvidenceInfluences,
	categoryMeta,
	evidenceSignalBand,
	type ResearchStateData,
	toPercent,
} from "./ResearchPanel.shared";

type EvidenceSignalDetailsModalProps = {
	selectedEvidenceState: ResearchStateData | undefined;
	primaryCategory: ResearchCategory;
	secondaryCategory: ResearchCategory;
	methodology: ResearchMethodology;
	maxMomentum: number;
	maxEvidence: number;
	onClose: () => void;
};

export function EvidenceSignalDetailsModal({
	selectedEvidenceState,
	primaryCategory,
	secondaryCategory,
	methodology,
	maxMomentum,
	maxEvidence,
	onClose,
}: EvidenceSignalDetailsModalProps) {
	if (!selectedEvidenceState) {
		return null;
	}

	const momentumPercent = toPercent(
		Number(selectedEvidenceState.cumulativeMomentum),
		maxMomentum,
	);
	const evidencePercent = toPercent(
		Number(selectedEvidenceState.recentEvidence),
		maxEvidence,
	);
	const evidenceBand = evidenceSignalBand(evidencePercent);
	const influences = buildEvidenceInfluences({
		category: selectedEvidenceState.category,
		primaryCategory,
		secondaryCategory,
		methodology,
		phase: selectedEvidenceState.phase,
		momentumPercent,
		breakthroughCount: selectedEvidenceState.breakthroughCount,
	});

	return (
		<DetailsModal
			onClose={onClose}
			title={`${categoryMeta[selectedEvidenceState.category].label} evidence signal`}
			size="lg"
		>
			<Stack gap="md">
				<Group justify="space-between" align="center">
					<Badge color={evidenceBand.color} variant="light">
						{evidenceBand.label}
					</Badge>
					<Text size="sm" c="dimmed">
						Signal strength {evidencePercent}%
					</Text>
				</Group>

				<Progress value={evidencePercent} color="teal" radius="xl" size="xl" />

				<Alert icon={<IconSparkles size={16} />} color="blue" variant="light">
					Improve this signal by keeping focus stable for multiple turns and
					matching methodology to the current phase.
				</Alert>

				<List spacing="sm" size="sm">
					{influences.map((influence) => (
						<List.Item
							key={influence.title}
							icon={
								<Badge size="xs" variant="light">
									{influence.influence}
								</Badge>
							}
						>
							<Text fw={600}>{influence.title}</Text>
							<Text c="dimmed">{influence.hint}</Text>
						</List.Item>
					))}
				</List>
			</Stack>
		</DetailsModal>
	);
}
