import {
	Box,
	Image,
	Loader,
	Overlay,
	SimpleGrid,
	Stack,
	Text,
} from "@mantine/core";
import { useState } from "react";
import type { CombatEngagementPanelQuery } from "../../gql/graphql";
import { CARD_DESCRIPTIONS, CARD_LABELS } from "./utils";

type ParticipantType = NonNullable<
	CombatEngagementPanelQuery["taskForceEngagement"]
>["participantA"];

export function CombatPlayerHand({
	ownParticipant,
	canSubmit,
	onSubmit,
}: {
	ownParticipant: ParticipantType;
	canSubmit: boolean;
	onSubmit: (cardId: string) => Promise<void>;
}) {
	const [submittingCardId, setSubmittingCardId] = useState<string | null>(null);
	const cardRenderCounts = new Map<string, number>();

	return (
		<Stack gap="xs">
			<Text fw={600}>Your hand</Text>
			<SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="sm">
				{ownParticipant.hand.map((cardId) => {
					const occurrence = (cardRenderCounts.get(cardId) ?? 0) + 1;
					cardRenderCounts.set(cardId, occurrence);

					const isSubmittingThis = submittingCardId === cardId;
					const isDisabled = !canSubmit && !isSubmittingThis;
					const cardName = CARD_LABELS[cardId] ?? cardId;
					const cardDesc = CARD_DESCRIPTIONS[cardId] ?? "";

					return (
						<Box
							key={`${cardId}-${occurrence}`}
							component="button"
							onClick={async () => {
								if (isDisabled || isSubmittingThis) return;
								setSubmittingCardId(cardId);
								try {
									await onSubmit(cardId);
								} finally {
									setSubmittingCardId(null);
								}
							}}
							style={{
								cursor: isDisabled ? "not-allowed" : "pointer",
								opacity: isDisabled ? 0.6 : 1,
								position: "relative",
								width: "100%",
								padding: 0,
								border: "none",
								background: "transparent",
								textAlign: "left",
								transition: "transform 0.2s ease",
							}}
							onMouseEnter={(e) => {
								if (!isDisabled)
									e.currentTarget.style.transform = "translateY(-4px)";
							}}
							onMouseLeave={(e) => {
								if (!isDisabled)
									e.currentTarget.style.transform = "translateY(0)";
							}}
						>
							<div
								style={{
									position: "relative",
									width: "100%",
									aspectRatio: "2.5/3.5",
								}}
							>
								{/* Base Artwork */}
								<Image
									src={`/images/cards/${cardId}.png`}
									style={{
										position: "absolute",
										top: "16%",
										left: "10%",
										width: "80%",
										height: "45%",
										objectFit: "cover",
									}}
								/>

								{/* Overlay Frame */}
								<Image
									src="/images/cards/frame.png"
									h="100%"
									w="100%"
									style={{
										position: "absolute",
										top: 0,
										left: 0,
										zIndex: 1,
										objectFit: "cover",
									}}
								/>

								{/* Card Text Content Details */}
								<div
									style={{
										position: "absolute",
										top: "11.5%",
										left: "12%",
										right: "12%",
										zIndex: 2,
										textAlign: "center",
									}}
								>
									<Text
										fw={800}
										size="sm"
										c="#dcf0ff"
										style={{
											textShadow: "1px 1px 3px black",
											letterSpacing: "1px",
										}}
									>
										{cardName.toUpperCase()}
									</Text>
								</div>

								<div
									style={{
										position: "absolute",
										top: "71%",
										bottom: "13%",
										left: "12%",
										right: "12%",
										zIndex: 2,
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										textAlign: "center",
									}}
								>
									<Text size="xs" c="gray.3" fw={500} lh={1.2}>
										{cardDesc}
									</Text>
								</div>
							</div>

							{isSubmittingThis && (
								<Overlay
									center
									color="#fff"
									backgroundOpacity={0.5}
									zIndex={5}
									radius="12px"
								>
									<Loader color="blue" />
								</Overlay>
							)}
						</Box>
					);
				})}
			</SimpleGrid>
			{ownParticipant.submittedCardId && (
				<Text size="sm" c="dimmed">
					Submitted:{" "}
					{CARD_LABELS[ownParticipant.submittedCardId] ??
						ownParticipant.submittedCardId}
				</Text>
			)}
		</Stack>
	);
}
