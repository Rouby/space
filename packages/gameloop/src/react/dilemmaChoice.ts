import { dilemmas, eq, starSystems } from "@space/data/schema";
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

	for (const effect of dilemma.choices.find((choice) => choice.id === choiceId)
		?.effects ?? []) {
		switch (effect.type) {
			case "generateDilemma":
				switch (effect.params.promptName) {
					case "startingDilemmaFollowUp1": {
						const generated = generateRandomDilemma("startingDilemmaFollowUp1");

						const [homeSystem] = await drizzle
							.select()
							.from(starSystems)
							.where(eq(starSystems.ownerId, playerId));

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
							choices: generated.dilemma.choices.map(
								({ effectScript, ...choice }) => ({
									...choice,
									effects: [
										{
											type: "generateDilemma",
											params: {
												promptName: "startingDilemmaFollowUp2",
											},
										},
										// TODO: add effectScript as effect
									],
								}),
							),
						});
						break;
					}
					case "startingDilemmaFollowUp2": {
						const generated = generateRandomDilemma(
							"startingDilemmaFollowUp2",
						);

						const [homeSystem] = await drizzle
							.select()
							.from(starSystems)
							.where(eq(starSystems.ownerId, playerId));

						await drizzle.insert(dilemmas).values({
							gameId: dilemma.gameId,
							ownerId: playerId,
							correlation: {
								origin: "starSystems",
								id: homeSystem.id,
							},
							...generated.dilemma,
							choices: generated.dilemma.choices.map(
								({ effectScript, ...choice }) => ({
									...choice,
									effects: [
										// TODO: add effectScript as effect
									],
								}),
							),
						});
						break;
					}
				}
		}
		break;
	}
}
