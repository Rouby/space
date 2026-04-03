import {
	buildResearchWeights,
	computeBaseKnowledge,
	computeFatiguePenalty,
	computeMomentumGain,
	defaultResearchMethodology,
	defaultResearchPrimaryCategory,
	defaultResearchSecondaryCategory,
	fieldworkThreshold,
	hypothesisThreshold,
	type ResearchCategory,
	type ResearchMethodology,
	researchCategories,
	synthesisThreshold,
} from "@space/data/functions";
import {
	and,
	eq,
	games,
	inArray,
	isNotNull,
	lte,
	or,
	playerResearchDirectives,
	playerResearchMiniGameActions,
	playerResearchStates,
	players,
	sql,
	starSystemPopulations,
	starSystemResourceDiscoveries,
	starSystems,
	taskForceEngagements,
	taskForces,
} from "@space/data/schema";
import { gameId } from "../config.ts";
import type { Context, Transaction } from "./tick.ts";

function toNumber(value: string | number | null | undefined) {
	if (value == null) {
		return 0;
	}

	return Number(value);
}

function categoryEvidenceFromSignals({
	category,
	industryUtilized,
	projectCompletions,
	engagementRounds,
	engagementWins,
	populationMigrationsOverThreshold,
	colonizationCompleted,
	miningDepotMilestones,
}: {
	category: ResearchCategory;
	industryUtilized: number;
	projectCompletions: number;
	engagementRounds: number;
	engagementWins: number;
	populationMigrationsOverThreshold: number;
	colonizationCompleted: number;
	miningDepotMilestones: number;
}) {
	switch (category) {
		case "military":
			return engagementRounds * 2 + engagementWins * 3;
		case "industry":
			return Math.floor(industryUtilized / 10) + projectCompletions * 2;
		case "expansion":
			return populationMigrationsOverThreshold + colonizationCompleted * 3;
		case "discovery":
			return miningDepotMilestones;
		default:
			return 0;
	}
}

export async function tickResearch(
	tx: Transaction,
	ctx: Context,
): Promise<void> {
	const game = await tx.query.games.findFirst({
		where: eq(games.id, gameId),
		columns: { turnNumber: true },
	});

	if (!game) {
		return;
	}

	const gamePlayers = await tx
		.select({ playerId: players.userId })
		.from(players)
		.where(eq(players.gameId, gameId));

	if (gamePlayers.length === 0) {
		return;
	}

	const directives = await tx
		.select({
			playerId: playerResearchDirectives.playerId,
			turnNumber: playerResearchDirectives.turnNumber,
			primaryCategory: playerResearchDirectives.primaryCategory,
			secondaryCategory: playerResearchDirectives.secondaryCategory,
			methodology: playerResearchDirectives.methodology,
		})
		.from(playerResearchDirectives)
		.where(
			and(
				eq(playerResearchDirectives.gameId, gameId),
				lte(playerResearchDirectives.turnNumber, ctx.turn),
			),
		)
		.orderBy(
			playerResearchDirectives.playerId,
			playerResearchDirectives.turnNumber,
		);

	const directiveByPlayer = new Map<string, (typeof directives)[number]>();
	for (const directive of directives) {
		directiveByPlayer.set(directive.playerId, directive);
	}

	const researchStateSeedRows = gamePlayers.flatMap((player) =>
		researchCategories.map((category) => ({
			gameId,
			playerId: player.playerId,
			category,
			lastUpdatedTurn: ctx.turn,
		})),
	);

	if (researchStateSeedRows.length > 0) {
		await tx
			.insert(playerResearchStates)
			.values(researchStateSeedRows)
			.onConflictDoNothing();
	}

	const researchStates = await tx
		.select()
		.from(playerResearchStates)
		.where(eq(playerResearchStates.gameId, gameId));

	const miniGameActions = await tx
		.select({
			playerId: playerResearchMiniGameActions.playerId,
			targetCategory: playerResearchMiniGameActions.targetCategory,
			bonus: playerResearchMiniGameActions.bonus,
		})
		.from(playerResearchMiniGameActions)
		.where(
			and(
				eq(playerResearchMiniGameActions.gameId, gameId),
				eq(playerResearchMiniGameActions.turnNumber, ctx.turn),
			),
		);

	const stateByPlayerAndCategory = new Map(
		researchStates.map((row) => [`${row.playerId}:${row.category}`, row]),
	);
	const miniGameByPlayerAndCategory = new Map(
		miniGameActions.map((action) => [
			`${action.playerId}:${action.targetCategory}`,
			toNumber(action.bonus),
		]),
	);
	const breakthroughsByPlayer = new Map<string, number>();
	for (const state of researchStates) {
		const current = breakthroughsByPlayer.get(state.playerId) ?? 0;
		breakthroughsByPlayer.set(
			state.playerId,
			current + state.breakthroughCount,
		);
	}
	const breakthroughValues = [...breakthroughsByPlayer.values()].sort(
		(a, b) => a - b,
	);
	const medianBreakthroughs =
		breakthroughValues.length === 0
			? 0
			: (breakthroughValues[Math.floor(breakthroughValues.length / 2)] ?? 0);

	const ownedPopulation = await tx
		.select({
			playerId: starSystems.ownerId,
			populationBillions: sql<number>`COALESCE(SUM(${starSystemPopulations.amount}::numeric) / 1000000000, 0)`,
		})
		.from(starSystems)
		.innerJoin(
			starSystemPopulations,
			eq(starSystemPopulations.starSystemId, starSystems.id),
		)
		.where(and(eq(starSystems.gameId, gameId), isNotNull(starSystems.ownerId)))
		.groupBy(starSystems.ownerId);

	const ownedStarSystems = await tx
		.select({
			playerId: starSystems.ownerId,
			count: sql<number>`COUNT(*)`,
		})
		.from(starSystems)
		.where(and(eq(starSystems.gameId, gameId), isNotNull(starSystems.ownerId)))
		.groupBy(starSystems.ownerId);

	const ownedDiscoveries = await tx
		.select({
			playerId: starSystems.ownerId,
			count: sql<number>`COUNT(*)`,
		})
		.from(starSystems)
		.innerJoin(
			starSystemResourceDiscoveries,
			eq(starSystemResourceDiscoveries.starSystemId, starSystems.id),
		)
		.where(and(eq(starSystems.gameId, gameId), isNotNull(starSystems.ownerId)))
		.groupBy(starSystems.ownerId);

	const engagements = await tx
		.select({
			ownerIdA: taskForceEngagements.ownerIdA,
			ownerIdB: taskForceEngagements.ownerIdB,
			winnerTaskForceId: taskForceEngagements.winnerTaskForceId,
		})
		.from(taskForceEngagements)
		.where(
			and(
				eq(taskForceEngagements.gameId, gameId),
				or(
					eq(taskForceEngagements.startedAtTurn, ctx.turn),
					eq(taskForceEngagements.resolvedAtTurn, ctx.turn),
				),
			),
		);

	const winnerTaskForceIds = engagements
		.map((engagement) => engagement.winnerTaskForceId)
		.filter((id): id is string => Boolean(id));
	const winnerTaskForces =
		winnerTaskForceIds.length === 0
			? []
			: await tx
					.select({ id: taskForces.id, ownerId: taskForces.ownerId })
					.from(taskForces)
					.where(inArray(taskForces.id, winnerTaskForceIds));
	const winnerOwnerByTaskForceId = new Map(
		winnerTaskForces.map((winner) => [winner.id, winner.ownerId]),
	);

	const populationByPlayer = new Map(
		ownedPopulation.map((row) => [row.playerId ?? "", row.populationBillions]),
	);
	const systemsByPlayer = new Map(
		ownedStarSystems.map((row) => [row.playerId ?? "", row.count]),
	);
	const discoveriesByPlayer = new Map(
		ownedDiscoveries.map((row) => [row.playerId ?? "", row.count]),
	);

	const industryChanges = ctx.getIndustryChanges?.() ?? [];
	const industrialProjectCompletions =
		ctx.getIndustrialProjectCompletions?.() ?? [];
	const colonizationCompleted = ctx.getColonizationCompleted?.() ?? [];
	const populationMigrations = ctx.getPopulationMigrations?.() ?? [];
	const miningChanges = ctx.getMiningChanges?.() ?? [];

	const ownedSystems = await tx
		.select({ id: starSystems.id, ownerId: starSystems.ownerId })
		.from(starSystems)
		.where(and(eq(starSystems.gameId, gameId), isNotNull(starSystems.ownerId)));
	const ownerByStarSystemId = new Map(
		ownedSystems.map((system) => [system.id, system.ownerId ?? ""]),
	);

	for (const { playerId } of gamePlayers) {
		const directive = directiveByPlayer.get(playerId);
		const primaryCategory =
			directive?.primaryCategory ?? defaultResearchPrimaryCategory;
		const secondaryCategory =
			directive?.secondaryCategory ?? defaultResearchSecondaryCategory;
		const methodology = (directive?.methodology ??
			defaultResearchMethodology) as ResearchMethodology;
		const weights = buildResearchWeights(primaryCategory, secondaryCategory);

		const combatRounds = engagements.filter(
			(engagement) =>
				engagement.ownerIdA === playerId || engagement.ownerIdB === playerId,
		).length;
		const engagementWins = engagements.filter((engagement) => {
			if (!engagement.winnerTaskForceId) {
				return false;
			}

			const winnerOwnerId = winnerOwnerByTaskForceId.get(
				engagement.winnerTaskForceId,
			);
			return winnerOwnerId === playerId;
		}).length;

		const baseKnowledge = computeBaseKnowledge({
			populationBillions: populationByPlayer.get(playerId) ?? 0,
			starSystems: systemsByPlayer.get(playerId) ?? 0,
			discoveries: discoveriesByPlayer.get(playerId) ?? 0,
			combatRounds,
		});

		const playerIndustryUtilized = industryChanges
			.filter(
				(change) => ownerByStarSystemId.get(change.starSystemId) === playerId,
			)
			.reduce((acc, change) => acc + change.industryUtilized, 0);
		const playerProjectCompletions = industrialProjectCompletions.filter(
			(change) => ownerByStarSystemId.get(change.starSystemId) === playerId,
		).length;
		const playerColonizationCompleted = colonizationCompleted.filter(
			(change) => ownerByStarSystemId.get(change.starSystemId) === playerId,
		).length;
		const playerMigrationsOverThreshold = populationMigrations.filter(
			(migration) =>
				migration.allegianceToPlayerId === playerId &&
				Number(migration.amount) > 50_000,
		).length;
		const playerMiningDepotMilestones = miningChanges.filter(
			(change) =>
				ownerByStarSystemId.get(change.starSystemId) === playerId &&
				change.depotQuantity >= 100,
		).length;

		for (const category of researchCategories) {
			const state = stateByPlayerAndCategory.get(`${playerId}:${category}`);
			if (!state) {
				continue;
			}

			const nextConsecutivePrimary =
				primaryCategory === category ? state.consecutivePrimary + 1 : 0;
			const fatigue = computeFatiguePenalty(nextConsecutivePrimary);
			const evidence = categoryEvidenceFromSignals({
				category,
				industryUtilized: playerIndustryUtilized,
				projectCompletions: playerProjectCompletions,
				engagementRounds: combatRounds,
				engagementWins,
				populationMigrationsOverThreshold: playerMigrationsOverThreshold,
				colonizationCompleted: playerColonizationCompleted,
				miningDepotMilestones: playerMiningDepotMilestones,
			});
			const rawMomentumGained = computeMomentumGain({
				baseKnowledge,
				weight: weights[category],
				methodology,
				evidence,
				fatigue,
			});
			const miniGameBonus =
				miniGameByPlayerAndCategory.get(`${playerId}:${category}`) ?? 0;
			const playerBreakthroughs = breakthroughsByPlayer.get(playerId) ?? 0;
			const catchupBonus =
				medianBreakthroughs - playerBreakthroughs >= 2 ? 0.5 : 0;
			const momentumGained = Math.max(
				0,
				rawMomentumGained + miniGameBonus + catchupBonus,
			);

			let phase = state.phase;
			let phaseChanged = false;
			const cumulativeMomentum = Math.max(
				0,
				toNumber(state.cumulativeMomentum) + momentumGained,
			);
			const recentEvidence = toNumber(state.recentEvidence) * 0.6 + evidence;
			let synthesisProgress = toNumber(state.synthesisProgress);
			const breakthroughCount = state.breakthroughCount;

			if (
				phase === "hypothesis" &&
				cumulativeMomentum >= hypothesisThreshold(breakthroughCount)
			) {
				phase = "fieldwork";
				phaseChanged = true;
			}

			if (
				phase === "fieldwork" &&
				recentEvidence >= fieldworkThreshold(breakthroughCount)
			) {
				phase = "synthesis";
				synthesisProgress = 0;
				phaseChanged = true;
			}

			if (phase === "synthesis") {
				synthesisProgress += Math.max(0, momentumGained);
				const completionThreshold = synthesisThreshold(breakthroughCount);
				if (synthesisProgress >= completionThreshold) {
					// Synthesis completed; pause progression until player chooses an outcome.
					synthesisProgress = completionThreshold;
				}
			}

			ctx.addResearchProgressChange?.({
				playerId,
				category,
				momentumGained: momentumGained.toFixed(3),
				totalMomentum: cumulativeMomentum.toFixed(3),
				phase,
				phaseChanged,
			});

			await tx
				.update(playerResearchStates)
				.set({
					breakthroughCount,
					phase,
					cumulativeMomentum: cumulativeMomentum.toFixed(6),
					recentEvidence: recentEvidence.toFixed(6),
					synthesisProgress: synthesisProgress.toFixed(6),
					consecutivePrimary: nextConsecutivePrimary,
					lastUpdatedTurn: ctx.turn,
					updatedAt: sql`now()`,
				})
				.where(
					and(
						eq(playerResearchStates.gameId, gameId),
						eq(playerResearchStates.playerId, playerId),
						eq(playerResearchStates.category, category),
					),
				);
		}
	}
}
