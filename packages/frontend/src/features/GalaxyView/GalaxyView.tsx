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

export function GalaxyView() {
	const { id } = useParams({ from: "/games/$id" });

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
			}
		}
		taskForces {
			id
			name
			position
			owner {
				id
				name
			}
			orders {
				id
				type
				...on TaskForceMoveOrder {
					destination
				}
			}
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
		graphql(`mutation MoveTaskForce($id: ID!, $position: Vector!) {
		moveTaskForce(id: $id, position: $position) {
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
		query: graphql(`subscription TaskForceMovements{
		trackTaskForces {
			id
			position
			orders {
				id
				type
				...on TaskForceMoveOrder {
					destination
				}
			}
		}
	}`),
	});

	return (
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
							});
						}
					} else {
					}

					setSelection(null);
				}
			}}
			onPointerMove={(event) => {
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
		>
			<title>Galaxy View</title>
			{data?.game.starSystems.map((starSystem) => (
				<G
					key={starSystem.id}
					translateX={translateX}
					translateY={translateY}
					zoom={zoom}
					positionX={starSystem.position.x}
					positionY={starSystem.position.y}
				>
					<circle
						r="10"
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
						<circle
							r="5"
							fill={
								selection?.type === "TaskForce" && selection.id === taskForce.id
									? "yellow"
									: "red"
							}
							onPointerDown={(event) => {
								event.stopPropagation();
								setSelection({ type: "TaskForce", id: taskForce.id });
								didMove.current = true;
							}}
						/>
					</G>
					{taskForce.orders[0] && (
						<MoveOrder
							translateX={translateX}
							translateY={translateY}
							zoom={zoom}
							positionX={taskForce.position.x}
							positionY={taskForce.position.y}
							destinationX={taskForce.orders[0].destination.x}
							destinationY={taskForce.orders[0].destination.y}
						/>
					)}
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
		animate(positionX, currentPositionX, { duration: 1, ease: "linear" });
	}, [animate, positionX, currentPositionX]);
	useEffect(() => {
		animate(positionY, currentPositionY, { duration: 1, ease: "linear" });
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
		animate(positionX, currentPositionX, { duration: 1 });
	}, [animate, positionX, currentPositionX]);
	useEffect(() => {
		animate(positionY, currentPositionY, { duration: 1 });
	}, [animate, positionY, currentPositionY]);
	useEffect(() => {
		animate(destinationX, currentDestinationX, { duration: 1 });
	}, [animate, destinationX, currentDestinationX]);
	useEffect(() => {
		animate(destinationY, currentDestinationY, { duration: 1 });
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
