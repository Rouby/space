import { Badge, Card, Group, Stack, Text } from "@mantine/core";
import { motion } from "motion/react";
import type { ResearchMiniGamePromptData } from "../ResearchPanel.shared";

export type TriangulationRole = "support" | "conflict" | "control";

export const triangulationRoleMeta: Record<
	TriangulationRole,
	{ label: string; color: string; description: string }
> = {
	support: {
		label: "Corroboration",
		color: "teal",
		description: "Commit your strongest corroborating signal.",
	},
	conflict: {
		label: "Contradiction",
		color: "orange",
		description: "Flag the signal that challenges your theory.",
	},
	control: {
		label: "Baseline",
		color: "blue",
		description: "Anchor your baseline reference signal.",
	},
};

type SignalCardProps = {
	card: ResearchMiniGamePromptData["triangulationCards"][number];
	assignedRole?: TriangulationRole;
	onDropCard: (cardId: string, point: { x: number; y: number }) => void;
};

export function SignalCard({
	card,
	assignedRole,
	onDropCard,
}: SignalCardProps) {
	return (
		<motion.div
			drag
			dragMomentum={false}
			dragSnapToOrigin
			dragElastic={0.08}
			whileDrag={{
				scale: 1.04,
				zIndex: 1000,
				boxShadow: "0 14px 28px rgba(0, 0, 0, 0.35)",
			}}
			onDragEnd={(_, info) => {
				onDropCard(card.id, info.point);
			}}
			style={{
				cursor: "grab",
				position: "relative",
				zIndex: 1,
				touchAction: "none",
				willChange: "transform",
				display: "inline-block",
				flex: "0 0 auto",
				overflow: "visible",
				isolation: "isolate",
			}}
		>
			<Card
				withBorder
				radius="md"
				p="sm"
				style={{
					width: "clamp(132px, 20vw, 176px)",
					maxWidth: "100%",
					aspectRatio: "5 / 7",
					display: "flex",
					alignItems: "stretch",
					justifyContent: "space-between",
					background:
						"linear-gradient(165deg, rgba(15, 23, 42, 0.98), rgba(2, 6, 23, 0.98))",
					borderColor: "rgba(148, 163, 184, 0.35)",
				}}
			>
				<Stack gap={4} justify="space-between" style={{ width: "100%" }}>
					<Text size="sm" fw={700} c="gray.0">
						{card.label}
					</Text>
					<Group justify="space-between" align="center">
						<Text size="xs" c="gray.5">
							Signal: {card.tag}
						</Text>
						{assignedRole ? (
							<Badge
								size="xs"
								variant="light"
								color={triangulationRoleMeta[assignedRole].color}
							>
								{triangulationRoleMeta[assignedRole].label}
							</Badge>
						) : (
							<Badge size="xs" variant="light" color="gray">
								Drag
							</Badge>
						)}
					</Group>
				</Stack>
			</Card>
		</motion.div>
	);
}
