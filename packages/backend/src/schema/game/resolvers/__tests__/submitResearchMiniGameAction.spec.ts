import {
	buildResearchMiniGamePrompt,
	defaultResearchMethodology,
	defaultResearchPrimaryCategory,
} from "@space/data/functions";
import { createGraphQLError } from "graphql-yoga";
import { describe, expect, it, vi } from "vitest";
import { submitResearchMiniGameAction } from "../Mutation/submitResearchMiniGameAction.js";

type CallableResolver<TArgs extends unknown[], TResult> =
	| ((...args: TArgs) => TResult)
	| { resolve: (...args: TArgs) => TResult };

function resolverFn<TArgs extends unknown[], TResult>(
	resolver: CallableResolver<TArgs, TResult>,
) {
	return typeof resolver === "function" ? resolver : resolver.resolve;
}

const callSubmitResearchMiniGameAction = resolverFn(
	submitResearchMiniGameAction,
);

const baseGame = {
	id: "game-1",
	turnNumber: 6,
	startedAt: new Date(),
};

const basePlayer = {
	gameId: "game-1",
	userId: "user-1",
	color: "#fff",
	turnEndedAt: null,
	user: { id: "user-1", name: "User", email: "user@test.dev" },
};

const baseStates = [
	{
		category: "industry" as const,
		phase: "fieldwork" as const,
		recentEvidence: "2",
		synthesisProgress: "0",
		breakthroughCount: 0,
		consecutivePrimary: 1,
	},
];

describe("submitResearchMiniGameAction mutation", () => {
	it("rejects mismatched prompt identity", async () => {
		const ctx = {
			userId: "user-1",
			throwWithoutClaim: vi.fn(),
			drizzle: {
				query: {
					games: {
						findFirst: vi.fn().mockResolvedValue(baseGame),
					},
					players: {
						findFirst: vi.fn().mockResolvedValue(basePlayer),
					},
					playerResearchDirectives: {
						findFirst: vi.fn().mockResolvedValue({
							primaryCategory: "industry",
							methodology: "stable",
						}),
					},
					playerResearchStates: {
						findMany: vi.fn().mockResolvedValue(baseStates),
					},
				},
				insert: vi.fn(),
			},
		};

		await expect(
			callSubmitResearchMiniGameAction(
				{},
				{
					gameId: "game-1",
					miniGameType: "breakthrough_incident",
					targetCategory: "industry",
				},
				ctx as never,
				{} as never,
			),
		).rejects.toMatchObject(
			createGraphQLError("Mini-game prompt does not match current turn", {
				extensions: { code: "MINI_GAME_PROMPT_MISMATCH" },
			}),
		);
	});

	it("stores evaluated triangulation submission", async () => {
		const prompt = buildResearchMiniGamePrompt({
			turnNumber: baseGame.turnNumber,
			playerId: basePlayer.userId,
			primaryCategory: defaultResearchPrimaryCategory,
			methodology: defaultResearchMethodology,
			researchStates: baseStates.map((state) => ({
				category: state.category,
				phase: state.phase,
				recentEvidence: Number(state.recentEvidence),
				synthesisProgress: Number(state.synthesisProgress),
				breakthroughCount: state.breakthroughCount,
				consecutivePrimary: state.consecutivePrimary,
			})),
		});

		if (!prompt) throw new Error("Prompt generation failed in test setup");

		const cards = prompt.triangulationCards;
		const onConflictDoUpdate = vi.fn().mockResolvedValue(undefined);
		const values = vi.fn().mockReturnValue({ onConflictDoUpdate });
		const insert = vi.fn().mockReturnValue({ values });

		const ctx = {
			userId: "user-1",
			throwWithoutClaim: vi.fn(),
			drizzle: {
				query: {
					games: {
						findFirst: vi.fn().mockResolvedValue(baseGame),
					},
					players: {
						findFirst: vi.fn().mockResolvedValue(basePlayer),
					},
					playerResearchDirectives: {
						findFirst: vi.fn().mockResolvedValue({
							primaryCategory: "industry",
							methodology: "opportunistic",
						}),
					},
					playerResearchStates: {
						findMany: vi.fn().mockResolvedValue(baseStates),
					},
				},
				insert,
			},
		};

		const result = await callSubmitResearchMiniGameAction(
			{},
			{
				gameId: "game-1",
				miniGameType: "evidence_triangulation",
				targetCategory: prompt.targetCategory,
				triangulationSupportCardId: cards[0]?.id,
				triangulationConflictCardId: cards[1]?.id,
				triangulationControlCardId: cards[2]?.id,
			},
			ctx as never,
			{} as never,
		);

		expect(insert).toHaveBeenCalledTimes(1);
		expect(values).toHaveBeenCalledWith(
			expect.objectContaining({
				gameId: "game-1",
				playerId: "user-1",
				miniGameType: "evidence_triangulation",
				targetCategory: prompt.targetCategory,
			}),
		);
		expect(onConflictDoUpdate).toHaveBeenCalledTimes(1);
		expect(result).toMatchObject({ userId: "user-1", gameId: "game-1" });
	});
});
