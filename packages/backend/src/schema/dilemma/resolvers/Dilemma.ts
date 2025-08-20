import {
	and,
	dilemmas,
	eq,
	getLastKnownHelper,
	lastKnownStates,
	sql,
	starSystems,
} from "@space/data/schema";
import type { DilemmaResolvers } from "./../../types.generated.js";
export const Dilemma: DilemmaResolvers = {
	/* Implement Dilemma resolver logic here */
	choices: async (_parent, _arg, _ctx) => {
		return _parent.choices;
	},
	description: async (_parent, _arg, _ctx) => {
		return _parent.description;
	},
	id: async (_parent, _arg, _ctx) => {
		return _parent.id;
	},
	title: async (_parent, _arg, _ctx) => {
		return _parent.title;
	},
	position: async (_parent, _arg, _ctx) => {
		return _parent.position;
	},
	causation: async (_parent, _arg, ctx) => {
		const { VisibilityQuery, visibilityExists, possiblyHidden } =
			getLastKnownHelper({
				tx: ctx.drizzle,
				gameId: _parent.gameId,
				userId: ctx.userId ?? "",
				position: starSystems.position,
			});

		if (_parent.causation?.origin === "starSystems") {
			return {
				__typename: "StarSystem",
				...(
					await ctx.drizzle
						.with(VisibilityQuery)
						.select({
							id: starSystems.id,
							name: starSystems.name,
							gameId: starSystems.gameId,
							position: starSystems.position,

							discoverySlots: possiblyHidden(starSystems.discoverySlots).as(
								"discoverySlots",
							),
							discoveryProgress: possiblyHidden(
								starSystems.discoveryProgress,
							).as("discoveryProgress"),
							ownerId: possiblyHidden(starSystems.ownerId).as("ownerId"),

							isVisible:
								sql<boolean>`CASE WHEN ${visibilityExists} THEN TRUE ELSE FALSE END`.as(
									"isVisible",
								),
							lastUpdate:
								sql<Date>`CASE WHEN ${visibilityExists} THEN NULL ELSE ${lastKnownStates.lastUpdate} END`
									.mapWith(lastKnownStates.lastUpdate)
									.as("lastUpdate"),
						})
						.from(starSystems)
						.where(eq(starSystems.id, _parent.causation.id))
						.leftJoin(
							lastKnownStates,
							and(
								eq(lastKnownStates.gameId, _parent.gameId),
								eq(lastKnownStates.subjectId, starSystems.id),
							),
						)
				)[0],
			};
		}

		if (_parent.causation?.origin === "dilemmas") {
			return {
				__typename: "Dilemma",
				...(
					await ctx.drizzle
						.select()
						.from(dilemmas)
						.where(eq(dilemmas.id, _parent.causation.id))
				)[0],
			};
		}

		return null;
	},
	correlation: async (_parent, _arg, ctx) => {
		const { VisibilityQuery, visibilityExists, possiblyHidden } =
			getLastKnownHelper({
				tx: ctx.drizzle,
				gameId: _parent.gameId,
				userId: ctx.userId ?? "",
				position: starSystems.position,
			});

		if (_parent.correlation?.origin === "starSystems") {
			return {
				__typename: "StarSystem",
				...(
					await ctx.drizzle
						.with(VisibilityQuery)
						.select({
							id: starSystems.id,
							name: starSystems.name,
							gameId: starSystems.gameId,
							position: starSystems.position,

							discoverySlots: possiblyHidden(starSystems.discoverySlots).as(
								"discoverySlots",
							),
							discoveryProgress: possiblyHidden(
								starSystems.discoveryProgress,
							).as("discoveryProgress"),
							ownerId: possiblyHidden(starSystems.ownerId).as("ownerId"),

							isVisible:
								sql<boolean>`CASE WHEN ${visibilityExists} THEN TRUE ELSE FALSE END`.as(
									"isVisible",
								),
							lastUpdate:
								sql<Date>`CASE WHEN ${visibilityExists} THEN NULL ELSE ${lastKnownStates.lastUpdate} END`
									.mapWith(lastKnownStates.lastUpdate)
									.as("lastUpdate"),
						})
						.from(starSystems)
						.where(eq(starSystems.id, _parent.correlation.id))
						.leftJoin(
							lastKnownStates,
							and(
								eq(lastKnownStates.gameId, _parent.gameId),
								eq(lastKnownStates.subjectId, starSystems.id),
							),
						)
				)[0],
			};
		}

		if (_parent.correlation?.origin === "dilemmas") {
			return {
				__typename: "Dilemma",
				...(
					await ctx.drizzle
						.select()
						.from(dilemmas)
						.where(eq(dilemmas.id, _parent.correlation.id))
				)[0],
			};
		}

		return null;
	},
};
