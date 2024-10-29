import { TestScheduler } from "rxjs/testing";
import { expect, it, vi } from "vitest";
import { fromGameEvents } from "../../workers.ts";
import { taskForces$ } from "../taskForces.ts";

vi.mock("../../workers.ts");

it("should track taskforce movements", async () => {
	const testScheduler = new TestScheduler((actual, expected) => {
		// asserting the two objects are equal - required
		// for TestScheduler assertions to work via your test framework
		// e.g. using chai.
		expect(actual).toMatchObject(expected);
	});

	testScheduler.run((helpers) => {
		/**
		 * a: taskForce:appeared
		 * m: taskForce:position
		 * n: taskForce:position
		 * o: taskForce:position (not appeared for user)
		 * d: taskForce:disappeared
		 */
		const observed = "a--m-o-d--n";
		const expected = "a--m---d---";

		vi.mocked(fromGameEvents).mockReturnValue(
			helpers.cold(observed, {
				a: {
					type: "taskForce:appeared",
					id: "tf1",
					userId: "user",
					position: { x: 0, y: 0 },
					movementVector: null,
				},
				m: {
					type: "taskForce:position",
					id: "tf1",
					userId: "user",
					position: { x: 1, y: 1 },
					movementVector: { x: 1, y: 1 },
				},
				o: {
					type: "taskForce:position",
					id: "tf2",
					userId: "user2",
					position: { x: 1, y: 1 },
					movementVector: { x: 1, y: 1 },
				},
				d: {
					type: "taskForce:disappeared",
					id: "tf1",
					userId: "user",
				},
				n: {
					type: "taskForce:position",
					id: "tf1",
					userId: "user",
					position: { x: 2, y: 2 },
					movementVector: { x: 1, y: 1 },
				},
			}),
		);

		helpers
			.expectObservable(
				taskForces$({
					gameId: "game",
					userId: "user",
					initialTaskForces: [],
				}),
			)
			.toBe(expected, {
				a: {
					__typename: "PositionableApppearsEvent",
					subject: {
						__typename: "TaskForce",
						id: "tf1",
						position: { x: 0, y: 0 },
						movementVector: null,
						isVisible: true,
						lastUpdate: null,
					},
				},
				m: {
					__typename: "PositionableMovesEvent",
					subject: {
						__typename: "TaskForce",
						id: "tf1",
						position: { x: 1, y: 1 },
						movementVector: { x: 1, y: 1 },
					},
				},
				d: {
					__typename: "PositionableDisappearsEvent",
					subject: {
						__typename: "TaskForce",
						id: "tf1",
						position: { x: 1, y: 1 },
						isVisible: false,
						lastUpdate: expect.any(String),
					},
					removed: false,
				},
			});
	});
});

it("should track taskforce movements", async () => {
	const testScheduler = new TestScheduler((actual, expected) => {
		// asserting the two objects are equal - required
		// for TestScheduler assertions to work via your test framework
		// e.g. using chai.
		expect(actual).toMatchObject(expected);
	});

	testScheduler.run((helpers) => {
		/**
		 * a: taskForce:appeared
		 * m: taskForce:position
		 * n: taskForce:position
		 * o: taskForce:position (not appeared for user)
		 * d: taskForce:destroyed
		 */
		const observed = "a--m-o-d";
		const expected = "a--m---d";

		vi.mocked(fromGameEvents).mockReturnValue(
			helpers.cold(observed, {
				a: {
					type: "taskForce:appeared",
					id: "tf1",
					userId: "user",
					position: { x: 0, y: 0 },
					movementVector: null,
				},
				m: {
					type: "taskForce:position",
					id: "tf1",
					userId: "user",
					position: { x: 1, y: 1 },
					movementVector: { x: 1, y: 1 },
				},
				o: {
					type: "taskForce:position",
					id: "tf2",
					userId: "user2",
					position: { x: 1, y: 1 },
					movementVector: { x: 1, y: 1 },
				},
				d: {
					type: "taskForce:destroyed",
					id: "tf1",
					userId: "user",
				},
			}),
		);

		helpers
			.expectObservable(
				taskForces$({
					gameId: "game",
					userId: "user",
					initialTaskForces: [],
				}),
			)
			.toBe(expected, {
				a: {
					__typename: "PositionableApppearsEvent",
					subject: {
						__typename: "TaskForce",
						id: "tf1",
						position: { x: 0, y: 0 },
						movementVector: null,
						isVisible: true,
						lastUpdate: null,
					},
				},
				m: {
					__typename: "PositionableMovesEvent",
					subject: {
						__typename: "TaskForce",
						id: "tf1",
						position: { x: 1, y: 1 },
						movementVector: { x: 1, y: 1 },
					},
				},
				d: {
					__typename: "PositionableDisappearsEvent",
					subject: {
						__typename: "TaskForce",
						id: "tf1",
						position: { x: 1, y: 1 },
						isVisible: false,
						lastUpdate: expect.any(String),
					},
					removed: true,
				},
			});
	});
});
