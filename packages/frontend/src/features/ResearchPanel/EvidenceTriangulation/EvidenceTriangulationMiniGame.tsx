import {
	Badge,
	Button,
	Card,
	Group,
	SimpleGrid,
	Stack,
	Text,
} from "@mantine/core";
import { AnimatePresence, motion } from "motion/react";
import { type RefObject, useRef } from "react";
import type { ResearchMiniGamePromptData } from "../ResearchPanel.shared";
import {
	SignalCard,
	type TriangulationRole,
	triangulationRoleMeta,
} from "./SignalCard";

type EvidenceTriangulationMiniGameProps = {
	prompt: ResearchMiniGamePromptData;
	triangulationSupportCardId: string;
	triangulationConflictCardId: string;
	triangulationControlCardId: string;
	onTriangulationSupportCardIdChange: (value: string) => void;
	onTriangulationConflictCardIdChange: (value: string) => void;
	onTriangulationControlCardIdChange: (value: string) => void;
};

export function EvidenceTriangulationMiniGame({
	prompt,
	triangulationSupportCardId,
	triangulationConflictCardId,
	triangulationControlCardId,
	onTriangulationSupportCardIdChange,
	onTriangulationConflictCardIdChange,
	onTriangulationControlCardIdChange,
}: EvidenceTriangulationMiniGameProps) {
	const supportDropZoneRef = useRef<HTMLDivElement>(null);
	const conflictDropZoneRef = useRef<HTMLDivElement>(null);
	const controlDropZoneRef = useRef<HTMLDivElement>(null);

	const selectedByRole: Record<TriangulationRole, string> = {
		support: triangulationSupportCardId,
		conflict: triangulationConflictCardId,
		control: triangulationControlCardId,
	};

	const selectedRolesByCard = new Map<string, TriangulationRole>();
	if (triangulationSupportCardId) {
		selectedRolesByCard.set(triangulationSupportCardId, "support");
	}
	if (triangulationConflictCardId) {
		selectedRolesByCard.set(triangulationConflictCardId, "conflict");
	}
	if (triangulationControlCardId) {
		selectedRolesByCard.set(triangulationControlCardId, "control");
	}

	const setRoleSelection = (role: TriangulationRole, cardId: string) => {
		if (role === "support") {
			onTriangulationSupportCardIdChange(cardId);
		}

		if (role === "conflict") {
			onTriangulationConflictCardIdChange(cardId);
		}

		if (role === "control") {
			onTriangulationControlCardIdChange(cardId);
		}
	};

	const clearRole = (role: TriangulationRole) => {
		setRoleSelection(role, "");
	};

	const dropZones: Array<{
		role: TriangulationRole;
		ref: RefObject<HTMLDivElement | null>;
	}> = [
		{ role: "support", ref: supportDropZoneRef },
		{ role: "conflict", ref: conflictDropZoneRef },
		{ role: "control", ref: controlDropZoneRef },
	];

	const getDropRoleAtPoint = (point: { x: number; y: number }) => {
		for (const zone of dropZones) {
			const node = zone.ref.current;
			if (!node) {
				continue;
			}

			const rect = node.getBoundingClientRect();
			if (
				point.x >= rect.left &&
				point.x <= rect.right &&
				point.y >= rect.top &&
				point.y <= rect.bottom
			) {
				return zone.role;
			}
		}

		return null;
	};

	const assignCardToRole = (role: TriangulationRole, cardId: string) => {
		const previousRole = selectedRolesByCard.get(cardId);
		if (previousRole && previousRole !== role) {
			setRoleSelection(previousRole, "");
		}

		setRoleSelection(role, cardId);
	};

	const unassignedCards = prompt.triangulationCards.filter(
		(card) => !selectedRolesByCard.has(card.id),
	);

	return (
		<Stack
			gap="xs"
			style={{ overflow: "visible", position: "relative", zIndex: 0 }}
		>
			<Text size="sm" fw={600}>
				Drag each signal into its tactical channel
			</Text>

			<SimpleGrid
				cols={{ base: 1, sm: 3 }}
				spacing="md"
				style={{
					overflow: "visible",
					position: "relative",
					zIndex: 0,
				}}
			>
				{dropZones.map((zone) => {
					const meta = triangulationRoleMeta[zone.role];
					const selectedCard = prompt.triangulationCards.find(
						(card) => card.id === selectedByRole[zone.role],
					);

					return (
						<div
							key={`drop-zone-${zone.role}`}
							ref={zone.ref}
							style={{
								overflow: "visible",
								position: "relative",
								zIndex: 0,
							}}
						>
							<Card
								withBorder
								radius="md"
								p="sm"
								style={{
									minHeight: 260,
									borderStyle: "dotted",
									borderWidth: 2,
									borderColor: "rgba(148, 163, 184, 0.5)",
									background: "rgba(148, 163, 184, 0.05)",
									overflow: "visible",
									position: "relative",
									zIndex: 0,
								}}
							>
								<Stack gap={6} style={{ minHeight: 230, overflow: "visible" }}>
									<Group justify="space-between" align="center">
										<Badge color={meta.color} variant="light">
											{meta.label}
										</Badge>
										{selectedCard ? (
											<Button
												size="compact-xs"
												variant="subtle"
												color="gray"
												onClick={() => clearRole(zone.role)}
											>
												Withdraw
											</Button>
										) : null}
									</Group>

									<Text size="xs" c="dimmed">
										{meta.description}
									</Text>

									{selectedCard ? (
										<Group justify="center" style={{ overflow: "visible" }}>
											<AnimatePresence mode="wait">
												<motion.div
													key={`${zone.role}-${selectedCard.id}`}
													initial={{ opacity: 0, scale: 0.9, y: 8 }}
													animate={{
														opacity: 1,
														scale: 1,
														y: 0,
														boxShadow: [
															"0 0 0 rgba(0,0,0,0)",
															"0 0 0 3px rgba(34, 211, 238, 0.24)",
															"0 0 0 rgba(0,0,0,0)",
														],
													}}
													exit={{ opacity: 0, scale: 0.92, y: 6 }}
													transition={{
														duration: 0.28,
														ease: "easeOut",
														boxShadow: {
															duration: 0.4,
															times: [0, 0.45, 1],
														},
													}}
													style={{
														overflow: "visible",
														position: "relative",
														zIndex: 2,
													}}
												>
													<SignalCard
														card={selectedCard}
														assignedRole={zone.role}
														onDropCard={(cardId, point) => {
															const dropRole = getDropRoleAtPoint(point);
															if (dropRole) {
																assignCardToRole(dropRole, cardId);
															}
														}}
													/>
												</motion.div>
											</AnimatePresence>
										</Group>
									) : (
										<Text size="xs" c="dimmed">
											Drop a signal here
										</Text>
									)}
								</Stack>
							</Card>
						</div>
					);
				})}
			</SimpleGrid>

			<Card
				withBorder
				style={{
					overflow: "visible",
					position: "relative",
					zIndex: 0,
				}}
			>
				<Stack gap="xs">
					<Text size="sm" fw={600}>
						Signal Pool
					</Text>
					<Text size="xs" c="dimmed">
						Drag evidence cards into Corroboration, Contradiction, or Baseline.
					</Text>
					{unassignedCards.length > 0 ? (
						<Group
							gap="sm"
							wrap="wrap"
							align="stretch"
							style={{
								overflow: "visible",
								minHeight: 210,
								position: "relative",
								zIndex: 0,
							}}
						>
							{unassignedCards.map((card) => (
								<SignalCard
									key={`pool-${card.id}`}
									card={card}
									onDropCard={(cardId, point) => {
										const dropRole = getDropRoleAtPoint(point);
										if (dropRole) {
											assignCardToRole(dropRole, cardId);
										}
									}}
								/>
							))}
						</Group>
					) : (
						<Text size="xs" c="dimmed">
							All signals are currently assigned.
						</Text>
					)}
				</Stack>
			</Card>
		</Stack>
	);
}
