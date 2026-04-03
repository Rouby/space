import {
	buildResearchWeights,
	computeBaseKnowledge,
	computeFatiguePenalty,
	computeMomentumGain,
	defaultResearchMethodology,
	defaultResearchPrimaryCategory,
	defaultResearchSecondaryCategory,
	effectiveBonus,
	fieldworkThreshold,
	hypothesisThreshold,
	type ResearchCategory,
	type ResearchMethodology,
	researchCategories,
	resolveOutcomeCandidates,
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
	playerResearchOutcomes,
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

function deterministicHash(input: string): number {
	let hash = 2166136261;
	for (let i = 0; i < input.length; i += 1) {
		hash ^= input.charCodeAt(i);
		hash = Math.imul(hash, 16777619);
	}

	return Math.abs(hash >>> 0);
}

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

	const stateByPlayerAndCategory = new Map(
		researchStates.map((row) => [`${row.playerId}:${row.category}`, row]),
	);

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

	const existingOutcomes = await tx
		.select({
			playerId: playerResearchOutcomes.playerId,
			outcomeKey: playerResearchOutcomes.outcomeKey,
		})
		.from(playerResearchOutcomes)
		.where(eq(playerResearchOutcomes.gameId, gameId));
	const outcomeKeysByPlayer = existingOutcomes.reduce((acc, outcome) => {
		const keys = acc.get(outcome.playerId) ?? new Set<string>();
		keys.add(outcome.outcomeKey);
		acc.set(outcome.playerId, keys);
		return acc;
	}, new Map<string, Set<string>>());

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
			const momentumGained = Math.max(0, rawMomentumGained);

			let phase = state.phase;
			let phaseChanged = false;
			let cumulativeMomentum = Math.max(
				0,
				toNumber(state.cumulativeMomentum) + momentumGained,
			);
			let recentEvidence = toNumber(state.recentEvidence) * 0.6 + evidence;
			let synthesisProgress = toNumber(state.synthesisProgress);
			let breakthroughCount = state.breakthroughCount;

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
				if (synthesisProgress >= synthesisThreshold(breakthroughCount)) {
					const candidates = resolveOutcomeCandidates(
						category,
						secondaryCategory,
					)
						.map((candidate) => {
							const owned = outcomeKeysByPlayer.get(playerId);
							const novelty = owned?.has(candidate.key) ? 0.7 : 1;
							const antiDuplicate = owned?.has(candidate.key) ? 0.6 : 1;
							return {
								...candidate,
								score: candidate.baseWeight * novelty * antiDuplicate,
							};
						})
						.sort((a, b) => b.score - a.score);

					if (candidates.length > 0) {
						const top = candidates.slice(0, 2);
						const hash = deterministicHash(
							`${gameId}:${ctx.turn}:${playerId}:${category}:${breakthroughCount}`,
						);
						const picked = top[hash % top.length];
						const pickedMode = picked.modes[hash % picked.modes.length];
						const normalizedModifier =
							effectiveBonus(Math.abs(pickedMode.modifier)) *
							Math.sign(pickedMode.modifier || 1);

						await tx.insert(playerResearchOutcomes).values({
							gameId,
							playerId,
							category,
							turnNumber: ctx.turn,
							outcomeKey: picked.key,
							outcomeMode: pickedMode.mode,
							stat: pickedMode.stat,
							modifier: normalizedModifier.toFixed(6),
						});

						ctx.addResearchBreakthrough?.({
							playerId,
							category,
							outcomeKey: picked.key,
							outcomeMode: pickedMode.mode,
							stat: pickedMode.stat,
							modifier: normalizedModifier.toFixed(6),
						});

						const owned =
							outcomeKeysByPlayer.get(playerId) ?? new Set<string>();
						owned.add(picked.key);
						outcomeKeysByPlayer.set(playerId, owned);
					}

					breakthroughCount += 1;
					phase = "hypothesis";
					phaseChanged = true;
					cumulativeMomentum = 0;
					recentEvidence = Math.max(0, recentEvidence * 0.5);
					synthesisProgress = 0;
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
