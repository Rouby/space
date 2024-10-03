import { useParams } from "@tanstack/react-router";
import {
	type MotionValue,
	motion,
	useMotionTemplate,
	useMotionValue,
} from "framer-motion";
import { useRef } from "react";
import { useStyles } from "tss-react";
import { useQuery } from "urql";
import { graphql } from "../../gql";

export function GalaxyView() {
	const { id } = useParams({
		from: "/games/$id",
	});

	const [{ data }] = useQuery({
		query: graphql(`
query Galaxy($id: ID!) {
  game(id: $id) {
    id
		starSystems {
			id
			position
		}
  }
}`),
		variables: { id },
	});

	const { css } = useStyles();

	const translateX = useMotionValue(0);
	const translateY = useMotionValue(0);
	const zoom = useMotionValue(1);

	const dragging = useRef({ active: false, lastX: 0, lastY: 0 });

	return (
		<motion.div
			onContextMenu={(event) => event.preventDefault()}
			onPointerDown={(event) => {
				event.preventDefault();
				dragging.current.active = true;
				dragging.current.lastX = event.clientX;
				dragging.current.lastY = event.clientY;
			}}
			onPointerUp={() => {
				dragging.current.active = false;
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
			className={css({
				position: "relative",
				width: "100%",
				height: "100%",
				overflow: "hidden",
			})}
		>
			{data?.game.starSystems.map((planet) => (
				<Planet
					key={planet.id}
					translateX={translateX}
					translateY={translateY}
					zoom={zoom}
					positionX={planet.position.x}
					positionY={planet.position.y}
				/>
			))}
		</motion.div>
	);
}

function Planet({
	translateX,
	translateY,
	zoom,
	positionX: currentPositionX,
	positionY: currentPositionY,
}: {
	translateX: MotionValue<number>;
	translateY: MotionValue<number>;
	zoom: MotionValue<number>;
	positionX: number;
	positionY: number;
}) {
	const positionX = useMotionValue(currentPositionX);
	const positionY = useMotionValue(currentPositionY);

	const x = useMotionTemplate`calc(${translateX}px + (${positionX}px) * ${zoom})`;
	const y = useMotionTemplate`calc(${translateY}px + (${positionY}px) * ${zoom})`;

	return (
		<motion.div style={{ x, y, scale: zoom, height: 0, width: 0 }}>
			<div
				onPointerDown={(event) => {
					event.stopPropagation();
					console.log("planet");
				}}
				style={{
					width: 20,
					height: 20,
					background: "red",
					borderRadius: "50%",
					transform: "translate(-50%, -50%)",
				}}
			/>
		</motion.div>
	);
}
