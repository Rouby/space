import {
	and,
	dilemmas,
	eq,
	playerResearchStates,
	sql,
	starSystemPopulations,
	starSystems,
} from "@space/data/schema";
import { drizzle } from "../db.ts";
import { generateRandomDilemma } from "../randomGameContent.ts";

export async function reactDilemmaChoice({
	playerId,
	dilemmaId,
	choiceId,
}: {
	playerId: string;
	dilemmaId: string;
	choiceId: string;
}) {
	const [dilemma] = await drizzle
		.select()
		.from(dilemmas)
		.where(eq(dilemmas.id, dilemmaId));

	if (!dilemma) {
		return;
	}

	const [homeSystem] = await drizzle
		.select()
		.from(starSystems)
		.where(
			and(
				eq(starSystems.ownerId, playerId),
				eq(starSystems.gameId, dilemma.gameId),
			),
		);

	for (const effect of dilemma.choices.find((choice) => choice.id === choiceId)
		?.effects ?? []) {
		switch (effect.type) {
			case "modifyHomeSystem": {
				if (!homeSystem) {
					break;
				}

				await drizzle
					.update(starSystems)
					.set({
						industry:
							typeof effect.params.industryDelta === "number"
								? sql`${starSystems.industry} + ${effect.params.industryDelta}`
								: undefined,
						discoverySlots:
							typeof effect.params.discoverySlotsDelta === "number"
								? sql`${starSystems.discoverySlots} + ${effect.params.discoverySlotsDelta}`
								: undefined,
						populationGrowthBonus:
							typeof effect.params.populationGrowthBonusDelta === "string"
								? sql`${starSystems.populationGrowthBonus} + ${effect.params.populationGrowthBonusDelta}`
								: undefined,
						constructionCostModifier:
							typeof effect.params.constructionCostModifierDelta === "string"
								? sql`${starSystems.constructionCostModifier} + ${effect.params.constructionCostModifierDelta}`
								: undefined,
					})
					.where(eq(starSystems.id, homeSystem.id));
				break;
			}

			case "modifyHomePopulation": {
				if (!homeSystem) {
					break;
				}

				await drizzle
					.update(starSystemPopulations)
					.set({
						amount: sql`${starSystemPopulations.amount} + ${effect.params.delta}::bigint`,
					})
					.where(
						and(
							eq(starSystemPopulations.starSystemId, homeSystem.id),
							eq(starSystemPopulations.allegianceToPlayerId, playerId),
						),
					);
				break;
			}

			case "modifyResearchMomentum": {
				await drizzle
					.update(playerResearchStates)
					.set({
						cumulativeMomentum: sql`${playerResearchStates.cumulativeMomentum} + ${effect.params.delta}`,
					})
					.where(
						and(
							eq(playerResearchStates.gameId, dilemma.gameId),
							eq(playerResearchStates.playerId, playerId),
							eq(playerResearchStates.category, effect.params.category),
						),
					);
				break;
			}

			case "generateDilemma":
				switch (effect.params.promptName) {
					case "startingDilemmaFollowUp1": {
						const generated = generateRandomDilemma("startingDilemmaFollowUp1");

						if (!homeSystem) {
							break;
						}

						await drizzle.insert(dilemmas).values({
							gameId: dilemma.gameId,
							ownerId: playerId,
							correlation: {
								origin: "starSystems",
								id: homeSystem.id,
							},
							causation: {
								origin: "dilemmas",
								id: dilemma.id,
							},
							...generated.dilemma,
							choices: generated.dilemma.choices.map((choice) => ({
								...choice,
								effects: [
									...choice.effects,
									{
										type: "generateDilemma",
										params: {
											promptName: "startingDilemmaFollowUp2",
										},
									},
								],
							})),
						});
						break;
					}
					case "startingDilemmaFollowUp2": {
						const generated = generateRandomDilemma("startingDilemmaFollowUp2");

						if (!homeSystem) {
							break;
						}

						await drizzle.insert(dilemmas).values({
							gameId: dilemma.gameId,
							ownerId: playerId,
							correlation: {
								origin: "starSystems",
								id: homeSystem.id,
							},
							...generated.dilemma,
							choices: generated.dilemma.choices,
						});
						break;
					}
				}
				break;
		}
	}
}
