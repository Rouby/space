import {
	and,
	dilemmas,
	eq,
	inArray,
	isNull,
	players,
	starSystems,
	type TurnReportSummary,
	turnReports,
} from "@space/data/schema";
import { gameId } from "../config.ts";
import { generateRandomMidGameDilemma } from "../randomGameContent.ts";
import type { Context, Transaction } from "./tick.ts";

type MidGameCategory = "frontier" | "crisis" | "doctrine" | "anomaly";

type ResolvedEngagement = {
	ownerIdA: string;
	ownerIdB: string;
	resolvedAtTurn: number | null;
};

function pickCategory(
	weights: Array<{ category: MidGameCategory; weight: number }>,
) {
	const total = weights.reduce((acc, item) => acc + item.weight, 0);
	let roll = Math.random() * total;
	for (const item of weights) {
		roll -= item.weight;
		if (roll <= 0) {
			return item.category;
		}
	}
	return weights[weights.length - 1].category;
}

function reportHasMeaningfulEvents(summary: TurnReportSummary) {
	if ((summary.colonizationCompleted?.length ?? 0) > 0) {
		return true;
	}

	if ((summary.researchBreakthroughs?.length ?? 0) > 0) {
		return true;
	}

	return (summary.taskForceEngagements ?? []).some(
		(engagement) => engagement.status === "resolved",
	);
}

async function getQuietTurns(tx: Transaction, playerId: string) {
	const recent = await tx.query.turnReports.findMany({
		where: and(
			eq(turnReports.gameId, gameId),
			eq(turnReports.ownerId, playerId),
		),
		orderBy: (table, { desc }) => [desc(table.turnNumber)],
		limit: 8,
		columns: { summary: true },
	});

	let quietTurns = 0;
	for (const report of recent) {
		if (reportHasMeaningfulEvents(report.summary)) {
			break;
		}
		quietTurns += 1;
	}

	return quietTurns;
}

async function spawnMidGameDilemma(
	tx: Transaction,
	playerId: string,
	category: MidGameCategory,
) {
	const generated = generateRandomMidGameDilemma(category);

	const [homeSystem] = await tx
		.select({ id: starSystems.id })
		.from(starSystems)
		.where(
			and(eq(starSystems.gameId, gameId), eq(starSystems.ownerId, playerId)),
		);

	if (!homeSystem) {
		return;
	}

	await tx.insert(dilemmas).values({
		gameId,
		ownerId: playerId,
		correlation: {
			origin: "starSystems",
			id: homeSystem.id,
		},
		...generated.dilemma,
		choices: generated.dilemma.choices,
	});
}

export async function tickDilemmas(
	tx: Transaction,
	ctx: Context,
	{
		colonizationCompletedSystemIds,
		researchBreakthroughOwnerIds,
		resolvedEngagements,
	}: {
		colonizationCompletedSystemIds: string[];
		researchBreakthroughOwnerIds: string[];
		resolvedEngagements: ResolvedEngagement[];
	},
) {
	if (ctx.turn < 3) {
		return;
	}

	const playersInGame = await tx
		.select({ userId: players.userId })
		.from(players)
		.where(eq(players.gameId, gameId));

	const ownersByColonizationSystem =
		colonizationCompletedSystemIds.length > 0
			? await tx
					.select({ ownerId: starSystems.ownerId })
					.from(starSystems)
					.where(
						and(
							eq(starSystems.gameId, gameId),
							inArray(starSystems.id, colonizationCompletedSystemIds),
						),
					)
			: [];

	const colonizationOwners = new Set(
		ownersByColonizationSystem
			.map((row) => row.ownerId)
			.filter((ownerId): ownerId is string => Boolean(ownerId)),
	);
	const researchOwners = new Set(researchBreakthroughOwnerIds);
	const battleOwners = new Set<string>();

	for (const engagement of resolvedEngagements) {
		if (engagement.resolvedAtTurn !== ctx.turn) {
			continue;
		}
		battleOwners.add(engagement.ownerIdA);
		battleOwners.add(engagement.ownerIdB);
	}

	for (const player of playersInGame) {
		const [pendingDilemma] = await tx
			.select({ id: dilemmas.id })
			.from(dilemmas)
			.where(
				and(
					eq(dilemmas.gameId, gameId),
					eq(dilemmas.ownerId, player.userId),
					isNull(dilemmas.choosen),
				),
			)
			.limit(1);

		if (pendingDilemma) {
			continue;
		}

		let category: MidGameCategory | null = null;
		let shouldSpawn = false;

		if (colonizationOwners.has(player.userId)) {
			shouldSpawn = Math.random() < 0.18;
			category = pickCategory([
				{ category: "frontier", weight: 70 },
				{ category: "doctrine", weight: 30 },
			]);
		} else if (researchOwners.has(player.userId)) {
			shouldSpawn = Math.random() < 0.25;
			category = pickCategory([
				{ category: "doctrine", weight: 60 },
				{ category: "anomaly", weight: 40 },
			]);
		} else if (battleOwners.has(player.userId)) {
			shouldSpawn = Math.random() < 0.24;
			category = pickCategory([
				{ category: "crisis", weight: 70 },
				{ category: "doctrine", weight: 30 },
			]);
		} else {
			const quietTurns = await getQuietTurns(tx, player.userId);
			if (quietTurns >= 4) {
				const quietChance = Math.min(0.12 + 0.05 * (quietTurns - 4), 0.45);
				shouldSpawn = Math.random() < quietChance;
				category = pickCategory([
					{ category: "frontier", weight: 50 },
					{ category: "anomaly", weight: 50 },
				]);
			}
		}

		if (shouldSpawn && category) {
			await spawnMidGameDilemma(tx, player.userId, category);
		}
	}
}
