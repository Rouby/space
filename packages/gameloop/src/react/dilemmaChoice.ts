import { chats, createChat } from "@space/ai";
import { dilemmas, eq, starSystems } from "@space/data/schema";
import { drizzle } from "../db.ts";

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
						const generated = await createChat({
							messages: [
								...chats.startingDilemmas.startingMessages,
								chats.startingDilemmas.assistantGeneration(dilemma),
								chats.startingDilemmas.followUp1(dilemma.choosen ?? ""),
							],
							format: chats.startingDilemmas.format,
						});

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
						const [prevDilemma] = await drizzle
							.select()
							.from(dilemmas)
							.where(eq(dilemmas.id, dilemma.causation?.id ?? ""))
							.limit(1);

						const generated = await createChat({
							messages: [
								...chats.startingDilemmas.startingMessages,
								chats.startingDilemmas.assistantGeneration(prevDilemma),
								chats.startingDilemmas.followUp1(prevDilemma.choosen ?? ""),
								chats.startingDilemmas.assistantGeneration(dilemma),
								chats.startingDilemmas.followUp2(dilemma.choosen ?? ""),
							],
							format: chats.startingDilemmas.format,
						});

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
