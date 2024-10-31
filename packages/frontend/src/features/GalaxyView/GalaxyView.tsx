import { Menu } from "@mantine/core";
import { Application, extend } from "@pixi/react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { Container, Graphics, Sprite } from "pixi.js";
import "pixi.js/math-extras";
import { useRef, useState } from "react";
import { useStyles } from "tss-react";
import { useMutation, useQuery, useSubscription } from "urql";
import { useAuth } from "../../Auth";
import { graphql } from "../../gql";
import { Sensors } from "./Sensors";
import { StarSystem } from "./StarSystem";
import { TaskForce } from "./TaskForce";
import { TaskForceEngagement } from "./TaskForceEngagement";
import { Viewport } from "./Viewport";

extend({
	Container,
	Graphics,
	Sprite,
});

export function GalaxyView() {
	const { id } = useParams({ from: "/games/_authenticated/$id" });

	const { me } = useAuth();

	const [{ data }] = useQuery({
		query: graphql(`
query Galaxy($id: ID!) {
  game(id: $id) {
    id
		starSystems {
			id
			position
			owner {
				id
				name
				color
			}
			isVisible
			lastUpdate
			sensorRange
		}
		taskForces {
			id
			name
			position
			owner {
				id
				name
				color
			}
			orders {
				id
				...on TaskForceMoveOrder {
					destination
				}
			}
			movementVector
			isVisible
			lastUpdate
			sensorRange
		}
		taskForceEngagements {
			id
			position
			phase
			phaseProgress
			taskForces {
				id
				name
				position
				owner {
					id
					name
					color
				}
			}
		}
  }
}`),
		variables: { id },
	});

	const [, orderTaskForce] = useMutation(
		graphql(`mutation OrderTaskForce($id: ID!, $orders: [TaskForceOrderInput!]!, $queue: Boolean) {
			orderTaskForce(id: $id, orders: $orders, queue: $queue) {
				id
				orders {
					id
					...on TaskForceMoveOrder {
						destination
					}
				}
			}
	}`),
	);

	useSubscription({
		query: graphql(`subscription TrackMap($gameId: ID!) {
		trackGalaxy(gameId: $gameId) {
		  ... on PositionableApppearsEvent {
				subject {
					__typename
					id
					position
					... on TaskForce {
						isVisible
						lastUpdate
						movementVector
					}
					... on StarSystem {
						owner {
							id
							name
							color
						}
						isVisible
						lastUpdate
					}
				}
			}
		  ... on PositionableMovesEvent {
				subject {
					__typename
					id
					position
					... on TaskForce {
						movementVector
					}
				}
			}
		  ... on PositionableDisappearsEvent {
				subject {
					__typename
					id
					position
					... on TaskForce {
						isVisible
						lastUpdate
					}
					... on StarSystem {
						isVisible
						lastUpdate
					}
				}
				removed
			}
			... on StarSystemUpdateEvent {
				subject {
					id
					owner {
						id
						name
						color
					}
					sensorRange
				}
			}
			... on TaskForceJoinsEngagementEvent {
				subject {
					__typename
					id
					position
					taskForces {
						__typename
						id
						name
						owner {
							id
							name
							color
						}
					}
				}
			}
			... on TaskForceLeavesEngagementEvent {
				subject {
					__typename
					id
					position
					taskForces {
						__typename
						id
						name
						owner {
							id
							name
							color
						}
					}
				}
			}
		}
	}`),
		variables: { gameId: id },
	});

	const { css } = useStyles();

	const parentRef = useRef<HTMLDivElement>(null);

	const navigate = useNavigate();

	const [selectedTaskForce, setSelectedTaskForce] = useState<string>();

	const [menuOpened, setMenuOpened] = useState(false);
	const [menuPosition, setMenuPosition] = useState({ left: 0, top: 0 });
	const [menuContext, setMenuContext] = useState<{
		shift?: boolean;
		point?: { x: number; y: number };
		starSystemId?: string;
		taskForceId?: string;
	}>();
	const menuContextResolved = {
		starSystem: menuContext?.starSystemId
			? data?.game.starSystems.find((ss) => ss.id === menuContext.starSystemId)
			: null,
		taskForce: menuContext?.taskForceId
			? data?.game.taskForces.find(
					(tf) => tf.id === menuContext.taskForceId && tf.isVisible,
				)
			: null,
	};

	return (
		<div
			ref={parentRef}
			className={css({ position: "relative", overflow: "hidden" })}
		>
			<Application
				attachToDevTools={!import.meta.env.PROD}
				resizeTo={parentRef}
				antialias
				autoDensity
			>
				<container>
					<Viewport
						initialViewbox={[
							...(data?.game.starSystems
								.filter((s) => s.owner?.id.endsWith(me?.id ?? ""))
								.map((s) => s.position) ?? []),
							...(data?.game.taskForces
								.filter((s) => s.owner?.id.endsWith(me?.id ?? ""))
								.map((s) => s.position) ?? []),
						].reduce(
							(acc, pos) => {
								return {
									minX: Math.min(acc.minX, pos.x - 250),
									maxX: Math.max(acc.maxX, pos.x + 250),
									minY: Math.min(acc.minY, pos.y - 250),
									maxY: Math.max(acc.maxY, pos.y + 250),
								};
							},
							{
								minX: Number.POSITIVE_INFINITY,
								maxX: Number.NEGATIVE_INFINITY,
								minY: Number.POSITIVE_INFINITY,
								maxY: Number.NEGATIVE_INFINITY,
							},
						)}
						onClick={() => {
							if (selectedTaskForce) {
								setSelectedTaskForce(undefined);
							}
						}}
						onRightClick={(d) => {
							setMenuContext({
								shift: d.event.shiftKey,
								point: d.point,
							});
							setMenuPosition({ left: d.event.screenX, top: d.event.screenY });
							setMenuOpened(true);
						}}
					>
						<Sensors
							sensors={[
								...(data?.game.starSystems.filter(
									(s) =>
										typeof s.sensorRange === "number" &&
										s.sensorRange > 0 &&
										s.isVisible,
								) ?? []),
								...(data?.game.taskForces.filter(
									(s) =>
										typeof s.sensorRange === "number" &&
										s.sensorRange > 0 &&
										s.isVisible,
								) ?? []),
							]}
						/>
						{data?.game.starSystems.map((starSystem) => (
							<StarSystem
								key={starSystem.id}
								id={starSystem.id}
								position={starSystem.position}
								isVisible={starSystem.isVisible}
								ownerColor={starSystem.owner?.color}
								sensorRange={starSystem.sensorRange}
								onClick={(event) => {
									event.preventDefault();
									navigate({
										from: "/games/$id",
										to: "star-system/$starSystemId",
										params: { starSystemId: starSystem.id },
									});
								}}
								onRightClick={(event) => {
									event.preventDefault();
									setMenuContext({
										shift: event.shiftKey,
										point: starSystem.position,
										starSystemId: starSystem.id,
									});
									setMenuPosition({
										left: event.screenX,
										top: event.screenY,
									});
									setMenuOpened(true);
								}}
							/>
						))}
						{data?.game.taskForces.map((taskForce) => (
							<TaskForce
								key={taskForce.id}
								id={taskForce.id}
								position={taskForce.position}
								isVisible={taskForce.isVisible}
								isSelected={taskForce.id === selectedTaskForce}
								ownerColor={taskForce.owner?.color}
								sensorRange={taskForce.sensorRange}
								onClick={(event) => {
									event.preventDefault();
									setSelectedTaskForce(taskForce.id);
								}}
								onRightClick={(event) => {
									event.preventDefault();
									setMenuContext({
										shift: event.shiftKey,
										point: taskForce.position,
										taskForceId: taskForce.id,
									});
									setMenuPosition({
										left: event.screenX,
										top: event.screenY,
									});
									setMenuOpened(true);
								}}
							/>
						))}
						{data?.game.taskForceEngagements.map((taskForceEngagement) => (
							<TaskForceEngagement
								key={taskForceEngagement.id}
								id={taskForceEngagement.id}
								position={taskForceEngagement.position}
								onClick={(event) => {
									event.preventDefault();
									navigate({
										from: "/games/$id",
										to: "task-force-engagement/$engagementId",
										params: { engagementId: taskForceEngagement.id },
									});
								}}
								// onRightClick={(event) => {
								// 	event.preventDefault();
								// 	setMenuContext({
								// 		shift: event.shiftKey,
								// 		point: taskForce.position,
								// 		taskForceId: taskForce.id,
								// 	});
								// 	setMenuPosition({
								// 		left: event.screenX,
								// 		top: event.screenY,
								// 	});
								// 	setMenuOpened(true);
								// }}
							/>
						))}
					</Viewport>
				</container>
			</Application>
			<Menu opened={menuOpened} onChange={setMenuOpened} position="right-start">
				<Menu.Target>
					<div className={css({ position: "absolute", ...menuPosition })} />
				</Menu.Target>

				<Menu.Dropdown>
					<Menu.Label>Menu</Menu.Label>
					{selectedTaskForce && (
						<>
							<Menu.Item
								onClick={() => {
									if (menuContext?.point) {
										orderTaskForce({
											id: selectedTaskForce,
											orders: [{ move: { destination: menuContext.point } }],
											queue: menuContext.shift,
										});
									}
								}}
							>
								{menuContext?.shift ? "Queue " : ""}Move here
							</Menu.Item>

							{menuContextResolved.starSystem &&
								!menuContextResolved.starSystem.owner && (
									<Menu.Item
										onClick={() => {
											orderTaskForce({
												id: selectedTaskForce,
												orders: [
													{
														move: {
															destination:
																// biome-ignore lint/style/noNonNullAssertion: <explanation>
																menuContextResolved.starSystem!.position,
														},
													},
													{
														colonize: true,
													},
												],
												queue: menuContext?.shift,
											});
										}}
									>
										{menuContext?.shift ? "Queue " : ""}Colonize system
									</Menu.Item>
								)}

							{menuContextResolved.taskForce && (
								<Menu.Item
									onClick={() => {
										orderTaskForce({
											id: selectedTaskForce,
											orders: [
												{
													follow: {
														taskForceId:
															// biome-ignore lint/style/noNonNullAssertion: <explanation>
															menuContextResolved.taskForce!.id,
													},
												},
											],
											queue: menuContext?.shift,
										});
									}}
								>
									{menuContext?.shift ? "Queue " : ""}Follow task force
								</Menu.Item>
							)}
						</>
					)}
				</Menu.Dropdown>
			</Menu>
		</div>
	);
}
