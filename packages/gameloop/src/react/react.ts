import { reactDilemmaChoice } from "./dilemmaChoice.ts";

export async function react(event: {
	type: string;
	playerId: string;
	dilemmaId: string;
	choiceId: string;
}) {
	switch (event.type) {
		case "dilemmaChoice":
			await reactDilemmaChoice({
				playerId: event.playerId,
				dilemmaId: event.dilemmaId,
				choiceId: event.choiceId,
			});
			break;
	}
}
