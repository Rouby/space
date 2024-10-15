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
import { useStyles } from "tss-react";
import { useMutation, useQuery, useSubscription } from "urql";
import { graphql } from "../../gql";
import { vars } from "../../theme";
import { StarSystem } from "./StarSystem";
import { TaskForce } from "./TaskForce";
import { coordinateToGrid, gridSizes } from "./coordinateToGrid";

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
	const [gridLevel, setGridLevel] = useState(0);
	const tileSize = gridSizes[gridLevel];

	const [{ tileColumns, tileRows }, setTiles] = useState({
		tileColumns: 5,
		tileRows: 4,
	});

	const [gridStartingX, setGridStartingX] = useState(
		Math.floor(-translateX.get() / tileSize) * tileSize,
	);
	const [gridStartingY, setGridStartingY] = useState(
		Math.floor(translateY.get() / tileSize) * tileSize,
	);

	useEffect(() => {
		const subs = [
			translateX.on("change", updateStartingGrid),
			translateY.on("change", updateStartingGrid),
			zoom.on("change", updateStartingGrid),
		];

		updateStartingGrid();

		return () => {
			for (const unsub of subs) {
				unsub();
			}
		};

		function updateStartingGrid() {
			const x = translateX.get() / zoom.get();
			const y = translateY.get() / zoom.get();

			setGridStartingX(
				-Math.floor(x / tileSize - (x <= 0 ? -1 : 0)) * tileSize,
			);
			setGridStartingY(
				-Math.floor(y / tileSize - (y <= 0 ? -1 : 0)) * tileSize,
			);
		}
	}, [translateX, translateY, zoom, tileSize]);

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
				...on TaskForceMoveOrder {
					destination
				}
			}
		}
		
		queueTaskForceMove(id: $id, position: $position) @include(if: $queueOrder) {
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
						movementVector
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
				}
			}
		}
	}`),
		variables: { gameId: id },
	});

	return (
		<>
			{/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
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

					const newGridLevel = [0.1, 10000].findIndex(
						(cutoff) => cutoff >= newZoom,
					);

					console.log({ newZoom, newGridLevel });

					const newTileSize = gridSizes[newGridLevel];

					const newTileColumns =
						Math.ceil(
							event.currentTarget.clientWidth / (newTileSize * newZoom),
						) + 2;
					const newTileRows =
						Math.ceil(
							event.currentTarget.clientHeight / (newTileSize * newZoom),
						) + 2;
					if (newTileColumns !== tileColumns || newTileRows !== tileRows) {
						setTiles({ tileColumns: newTileColumns, tileRows: newTileRows });
					}
					if (newGridLevel !== gridLevel) {
						setGridLevel(newGridLevel);
					}
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

						const tilesX = Math.ceil(width / tileSize) + 2;
						const tilesY = Math.ceil(height / tileSize) + 2;
						setTiles({ tileColumns: tilesX, tileRows: tilesY });
					}
				}}
				style={{ background: "black" }}
			>
				{Array.from({ length: tileRows }, (_, row) =>
					Array.from({ length: tileColumns }, (_, column) => (
						<BackgroundTile
							key={`${gridStartingX + column * tileSize},${gridStartingY + row * tileSize}`}
							gridLevel={gridLevel}
							column={column - 1}
							row={row - 1}
							gridStartingX={gridStartingX}
							gridStartingY={gridStartingY}
							translateX={translateX}
							translateY={translateY}
							zoom={zoom}
						/>
					)),
				)}
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
									selection?.type === "TaskForce" &&
									selection.id === taskForce.id
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

				<filter
					id="nnnoise-filter"
					x="-20%"
					y="-20%"
					width="140%"
					height="140%"
					filterUnits="objectBoundingBox"
					primitiveUnits="objectBoundingBox"
					color-interpolation-filters="linearRGB"
				>
					<feTurbulence
						type="fractalNoise"
						baseFrequency="0.102"
						numOctaves="4"
						seed="15"
						stitchTiles="stitch"
						x="0%"
						y="0%"
						width="100%"
						height="100%"
						result="turbulence"
					/>
					<feSpecularLighting
						surfaceScale="15"
						specularConstant="0.75"
						specularExponent="20"
						lighting-color="#777777"
						x="0%"
						y="0%"
						width="100%"
						height="100%"
						in="turbulence"
						result="specularLighting"
					>
						<feDistantLight azimuth="3" elevation="100" />
					</feSpecularLighting>
				</filter>
			</motion.svg>
			<Coordinates
				translateX={translateX}
				translateY={translateY}
				zoom={zoom}
			/>
		</>
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

function BackgroundTile({
	gridLevel,
	column,
	row,
	gridStartingX,
	gridStartingY,
	translateX,
	translateY,
	zoom,
}: {
	gridLevel: number;
	column: number;
	row: number;
	gridStartingX: number;
	gridStartingY: number;
	translateX: MotionValue<number>;
	translateY: MotionValue<number>;
	zoom: MotionValue<number>;
}) {
	const tileSize = gridSizes[gridLevel];
	const size = useTransform(() => tileSize * zoom.get());
	const x = useTransform(
		() =>
			(translateX.get() % (tileSize * zoom.get())) +
			column * tileSize * zoom.get(),
	);
	const y = useTransform(
		() =>
			(translateY.get() % (tileSize * zoom.get())) +
			row * tileSize * zoom.get(),
	);

	const coordinates = coordinateToGrid(
		{
			x: gridStartingX + column * tileSize,
			y: gridStartingY + row * tileSize,
		},
		gridLevel,
	);

	const dx = useTransform(() => size.get() / 2);
	const fontSize = useTransform(
		() => (gridLevel === 0 ? 3000 : 300) * zoom.get(),
	);

	return (
		<motion.g style={{ x, y }}>
			<motion.rect
				fill="black"
				strokeWidth={gridLevel === 0 ? 2 : 1}
				stroke={
					coordinates
						? gridLevel === 0
							? "rgba(255,255,255,.6)"
							: "rgba(255,255,255,.4)"
						: "rgba(255,255,255,.1)"
				}
				style={{ width: size, height: size }}
			/>
			<motion.rect
				filter="url(#nnnoise-filter)"
				style={{ width: size, height: size }}
			/>
			<motion.text
				dx={dx}
				dy={dx}
				fill="white"
				textAnchor="middle"
				alignmentBaseline="middle"
				fontSize={fontSize}
				pointerEvents="none"
				opacity={0.1}
			>
				{coordinates}
			</motion.text>
		</motion.g>
	);
}

function Coordinates({
	translateX,
	translateY,
	zoom,
}: {
	translateX: MotionValue<number>;
	translateY: MotionValue<number>;
	zoom: MotionValue<number>;
}) {
	const { css } = useStyles();

	const [coordinates, setCoordinates] = useState("");

	useEffect(() => {
		const subs = [
			translateX.on("change", updateCoordinates),
			translateY.on("change", updateCoordinates),
			zoom.on("change", updateCoordinates),
		];

		let pointerX = 0;
		let pointerY = 0;

		window.addEventListener("pointermove", updateCoordinates);

		updateCoordinates();

		return () => {
			window.removeEventListener("pointermove", updateCoordinates);
			for (const unsub of subs) {
				unsub();
			}
		};

		function updateCoordinates(event?: PointerEvent | number) {
			if (anchorRef.current && event && typeof event !== "number") {
				const { x, y } = anchorRef.current.getBoundingClientRect();

				pointerX = event.clientX - x;
				pointerY = event.clientY - y;
			}

			const x = (pointerX - translateX.get()) / zoom.get();
			const y = (pointerY - translateY.get()) / zoom.get();

			setCoordinates(coordinateToGrid({ x, y }, 2));
		}
	}, [translateX, translateY, zoom]);

	const anchorRef = useRef<HTMLDivElement>(null);

	return (
		<>
			<div
				ref={anchorRef}
				className={css({
					position: "absolute",
					top: 0,
					left: 0,
				})}
			/>
			<div
				className={css({
					position: "absolute",
					bottom: 0,
					left: 0,
					background: vars.colors.gray[8],
					padding: vars.spacing.xs,
				})}
			>
				{coordinates}
			</div>
		</>
	);
}
