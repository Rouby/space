import { useNavigate, useParams } from "@tanstack/react-router";
import {
	type MotionValue,
	motion,
	useAnimate,
	useMotionTemplate,
	useMotionValue,
	useTransform,
} from "framer-motion";
import { Fragment, useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useSubscription } from "urql";
import { graphql } from "../../gql";
import { StarSystem } from "./StarSystem";
import { TaskForce } from "./TaskForce";

export function GalaxyView() {
	const { id } = useParams({ from: "/games/_authenticated/$id" });

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
				type
				...on TaskForceMoveOrder {
					destination
				}
			}
			movementVector
		}
  }
}`),
		variables: { id },
	});

	const translateX = useMotionValue(0);
	const translateY = useMotionValue(0);
	const zoom = useMotionValue(1);

	const dragging = useRef({ active: false, lastX: 0, lastY: 0 });

	const navigate = useNavigate();

	const [selection, setSelection] = useState<{
		type: "TaskForce";
		id: string;
	} | null>(null);

	const didMove = useRef(false);

	const [, moveTaskForce] = useMutation(
		graphql(`mutation MoveTaskForce($id: ID!, $position: Vector!, $queueOrder: Boolean!) {
		moveTaskForce(id: $id, position: $position) @skip(if: $queueOrder) {
			id
			orders {
				id
				type
				...on TaskForceMoveOrder {
					destination
				}
			}
		}
		
		queueTaskForceMove(id: $id, position: $position) @include(if: $queueOrder) {
			id
			orders {
				id
				type
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
		  type
			subject {
				__typename
				id
				position
			}
		}
	}`),
		variables: { gameId: id },
	});

	return (
		// biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
		<motion.svg
			onContextMenu={(event) => {
				event.preventDefault();
			}}
			onPointerDown={(event) => {
				event.preventDefault();
				dragging.current.active = true;
				dragging.current.lastX = event.clientX;
				dragging.current.lastY = event.clientY;

				didMove.current = false;
			}}
			onPointerUp={(event) => {
				dragging.current.active = false;
				if (!didMove.current) {
					if (event.button === 2) {
						if (selection?.type === "TaskForce") {
							const { x, y } = event.currentTarget.getBoundingClientRect();
							moveTaskForce({
								id: selection.id,
								position: {
									x: (event.clientX - x - translateX.get()) / zoom.get(),
									y: (event.clientY - y - translateY.get()) / zoom.get(),
								},
								queueOrder: event.shiftKey,
							});
						}
					} else {
						setSelection(null);
					}
				}
			}}
			onPointerMove={(event) => {
				const { x, y } = event.currentTarget.getBoundingClientRect();
				const position = {
					x: (event.clientX - x - translateX.get()) / zoom.get(),
					y: (event.clientY - y - translateY.get()) / zoom.get(),
				};
				console.log(position);

				if (!dragging.current.active) return;

				translateX.set(
					translateX.get() + (event.clientX - dragging.current.lastX),
				);
				translateY.set(
					translateY.get() + (event.clientY - dragging.current.lastY),
				);
				dragging.current.lastX = event.clientX;
				dragging.current.lastY = event.clientY;

				didMove.current = true;
			}}
			onWheel={(event) => {
				const zoomFactor = 1 + Math.abs(event.deltaY) * 0.001;
				const zoomIn = event.deltaY < 0;

				const oldZoom = zoom.get();
				const newZoom = zoom.get() * (zoomIn ? zoomFactor : 1 / zoomFactor);

				const { x: elementX, y: elementY } =
					event.currentTarget.getBoundingClientRect();

				const mouseX = event.clientX - elementX;
				const mouseY = event.clientY - elementY;

				translateX.set(
					mouseX - (mouseX - translateX.get()) * (newZoom / oldZoom),
				);
				translateY.set(
					mouseY - (mouseY - translateY.get()) * (newZoom / oldZoom),
				);

				zoom.set(newZoom);
			}}
			width="100%"
			height="100%"
			ref={(node) => {
				if (node) {
					const { width, height } = node.getBoundingClientRect();
					const { minX, minY, maxX, maxY } = data?.game.starSystems
						.filter((system) => system.owner)
						.reduce(
							({ minX, minY, maxX, maxY }, { position }) => ({
								minX: Math.min(minX, position.x),
								minY: Math.min(minY, position.y),
								maxX: Math.max(maxX, position.x),
								maxY: Math.max(maxY, position.y),
							}),
							{
								minX: Number.POSITIVE_INFINITY,
								minY: Number.POSITIVE_INFINITY,
								maxX: Number.NEGATIVE_INFINITY,
								maxY: Number.NEGATIVE_INFINITY,
							},
						) ?? { minX: 0, minY: 0, maxX: 0, maxY: 0 };
					translateX.set(width / 2 - (minX + maxX) / 2);
					translateY.set(height / 2 - (minY + maxY) / 2);
				}
			}}
			style={{ background: "black" }}
		>
			{data?.game.starSystems.map((starSystem) => (
				<G
					key={starSystem.id}
					translateX={translateX}
					translateY={translateY}
					zoom={zoom}
					positionX={starSystem.position.x}
					positionY={starSystem.position.y}
				>
					<StarSystem
						zoom={zoom}
						onPointerDown={(event) => {
							if (!selection) {
								event.stopPropagation();
								navigate({
									from: "/games/$id",
									to: "star-system/$starSystemId",
									params: { starSystemId: starSystem.id },
								});
							}
						}}
					/>
				</G>
			))}
			{data?.game.taskForces.map((taskForce) => (
				<Fragment key={taskForce.id}>
					<G
						translateX={translateX}
						translateY={translateY}
						zoom={zoom}
						positionX={taskForce.position.x}
						positionY={taskForce.position.y}
					>
						<TaskForce
							owner={taskForce.owner}
							onPointerDown={(event) => {
								event.stopPropagation();
								setSelection({ type: "TaskForce", id: taskForce.id });
								didMove.current = true;
							}}
							selected={
								selection?.type === "TaskForce" && selection.id === taskForce.id
							}
							movementVector={taskForce.movementVector}
						/>
					</G>
					{selection?.type === "TaskForce" &&
						selection.id === taskForce.id &&
						taskForce.orders.map((order, idx, orders) => (
							<MoveOrder
								key={order.id}
								translateX={translateX}
								translateY={translateY}
								zoom={zoom}
								positionX={
									(orders[idx - 1]?.destination ?? taskForce.position).x
								}
								positionY={
									(orders[idx - 1]?.destination ?? taskForce.position).y
								}
								destinationX={order.destination.x}
								destinationY={order.destination.y}
							/>
						))}
				</Fragment>
			))}
		</motion.svg>
	);
}

function G({
	translateX,
	translateY,
	zoom,
	positionX: currentPositionX,
	positionY: currentPositionY,
	children,
}: {
	translateX: MotionValue<number>;
	translateY: MotionValue<number>;
	zoom: MotionValue<number>;
	positionX: number;
	positionY: number;
	children: React.ReactNode;
}) {
	const positionX = useMotionValue(currentPositionX);
	const positionY = useMotionValue(currentPositionY);
	const [, animate] = useAnimate();

	useEffect(() => {
		animate(positionX, currentPositionX, { duration: 0.1, ease: "linear" });
	}, [animate, positionX, currentPositionX]);
	useEffect(() => {
		animate(positionY, currentPositionY, { duration: 0.1, ease: "linear" });
	}, [animate, positionY, currentPositionY]);

	const x = useMotionTemplate`calc(${translateX}px + (${positionX}px) * ${zoom})`;
	const y = useMotionTemplate`calc(${translateY}px + (${positionY}px) * ${zoom})`;

	return <motion.g style={{ x, y, scale: zoom }}>{children}</motion.g>;
}

function MoveOrder({
	translateX,
	translateY,
	zoom,
	positionX: currentPositionX,
	positionY: currentPositionY,
	destinationX: currentDestinationX,
	destinationY: currentDestinationY,
}: {
	translateX: MotionValue<number>;
	translateY: MotionValue<number>;
	zoom: MotionValue<number>;
	positionX: number;
	positionY: number;
	destinationX: number;
	destinationY: number;
}) {
	const positionX = useMotionValue(currentPositionX);
	const positionY = useMotionValue(currentPositionY);
	const destinationX = useMotionValue(currentDestinationX);
	const destinationY = useMotionValue(currentDestinationY);
	const [, animate] = useAnimate();

	useEffect(() => {
		animate(positionX, currentPositionX, { duration: 0.1, ease: "linear" });
	}, [animate, positionX, currentPositionX]);
	useEffect(() => {
		animate(positionY, currentPositionY, { duration: 0.1, ease: "linear" });
	}, [animate, positionY, currentPositionY]);
	useEffect(() => {
		animate(destinationX, currentDestinationX, {
			duration: 0.1,
			ease: "linear",
		});
	}, [animate, destinationX, currentDestinationX]);
	useEffect(() => {
		animate(destinationY, currentDestinationY, {
			duration: 0.1,
			ease: "linear",
		});
	}, [animate, destinationY, currentDestinationY]);

	const x = useTransform(() => translateX.get() + positionX.get() * zoom.get());
	const y = useTransform(() => translateY.get() + positionY.get() * zoom.get());

	const dx = useTransform(
		() => translateX.get() + destinationX.get() * zoom.get(),
	);
	const dy = useTransform(
		() => translateY.get() + destinationY.get() * zoom.get(),
	);

	const d = useMotionTemplate`M${x},${y} L${dx},${dy}`;

	return <motion.path stroke="blue" d={d} />;
}
