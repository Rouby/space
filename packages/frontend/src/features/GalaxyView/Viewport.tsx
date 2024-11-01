import { useApplication, useTick } from "@pixi/react";
import {
	type Container,
	type FederatedPointerEvent,
	type FederatedWheelEvent,
	type Graphics,
	Point,
	Rectangle,
	Texture,
} from "pixi.js";
import "pixi.js/math-extras";
import { type RefObject, useEffect, useRef } from "react";

export function Viewport({
	initialViewbox,
	onClick,
	onRightClick,
	children,
}: {
	initialViewbox?: { minX: number; maxX: number; minY: number; maxY: number };
	onClick: (data: {
		event: FederatedPointerEvent;
		point: Point;
	}) => void;
	onRightClick: (data: {
		event: FederatedPointerEvent;
		point: Point;
	}) => void;
	children: React.ReactNode;
}) {
	const { app, isInitialised } = useApplication();
	const dragStart = useRef(new Point());
	const dragging = useRef(false);
	const viewportRef = useRef<Container>(null);
	const gridRef = useRef<Graphics>(null);

	useTick(() => {
		if (!gridRef.current || !viewportRef.current) return;

		const g = gridRef.current;
		const scale = viewportRef.current.scale.x;
		const x = viewportRef.current.x;
		const y = viewportRef.current.y;

		g.clear();

		drawGridLines(1000 * scale);
		g.setStrokeStyle({
			color: 0xffffff,
			alpha: 0.1,
			width: Math.max(1, 5 * scale),
		});
		g.stroke();

		drawGridLines(3000 * scale);
		g.setStrokeStyle({
			color: 0xffffff,
			alpha: 0.1,
			width: Math.max(2, 10 * scale),
		});
		g.stroke();

		function drawGridLines(size: number) {
			for (let yi = -size; yi < app.screen.height; yi += size) {
				for (let xi = -size; xi < app.screen.width; xi += size) {
					g.rect(
						xi + (x % size) + (x < 0 ? size : 0),
						yi + (y % size) + (y < 0 ? size : 0),
						size,
						size,
					);
				}
			}
		}
	});

	useInitialViewportRect(viewportRef, initialViewbox);

	if (!isInitialised) return null;

	return (
		<container
			interactive
			onPointerDown={(event: FederatedPointerEvent) => {
				dragging.current = true;
				app.renderer.events.mapPositionToPoint(
					dragStart.current,
					event.clientX,
					event.clientY,
				);
			}}
			onPointerMove={(event: FederatedPointerEvent) => {
				if (dragging.current) {
					const point = new Point();
					app.renderer.events.mapPositionToPoint(
						point,
						event.clientX,
						event.clientY,
					);
					const delta = point.subtract(dragStart.current);
					dragStart.current.copyFrom(point);

					if (viewportRef.current) {
						viewportRef.current.position =
							viewportRef.current.position.add(delta);
					}
				}
			}}
			onPointerUp={(event: FederatedPointerEvent) => {
				dragging.current = false;
				const point = new Point();
				app.renderer.events.mapPositionToPoint(
					point,
					event.clientX,
					event.clientY,
				);
				const delta = point.subtract(dragStart.current);

				if (
					viewportRef.current &&
					Math.abs(delta.x) < 5 &&
					Math.abs(delta.y) < 5 &&
					event.button === 0 &&
					!event.defaultPrevented
				) {
					onClick({
						event,
						point: viewportRef.current.toLocal(
							app.renderer.events.pointer.global,
						),
					});
				}
			}}
			onWheel={(event: FederatedWheelEvent) => {
				const point = new Point();
				app.renderer.events.mapPositionToPoint(
					point,
					event.clientX,
					event.clientY,
				);

				const scale = Math.max(0.01, 1 - event.deltaY * 0.001);

				if (
					viewportRef.current &&
					(scale > 1 || viewportRef.current?.scale.x >= 0.01)
				) {
					viewportRef.current.position.set(
						point.x + (viewportRef.current.x - point.x) * scale,
						point.y + (viewportRef.current.y - point.y) * scale,
					);
					viewportRef.current.scale =
						viewportRef.current.scale.multiplyScalar(scale);
				}
			}}
			onRightClick={(event: FederatedPointerEvent) => {
				if (
					viewportRef.current &&
					((event.eventPhase === Event.BUBBLING_PHASE &&
						!event.defaultPrevented) ||
						event.eventPhase === Event.AT_TARGET)
				) {
					event.preventDefault();
					onRightClick({
						event,
						point: viewportRef.current.toLocal(
							app.renderer.events.pointer.global,
						),
					});
				}
			}}
		>
			<sprite
				texture={Texture.WHITE}
				width={app.screen.width}
				height={app.screen.height}
				tint={0x000000}
			/>
			<graphics ref={gridRef} draw={() => {}} />
			<container ref={viewportRef} isRenderGroup>
				{children}
			</container>
		</container>
	);
}

function useInitialViewportRect(
	viewportRef: RefObject<Container>,
	initialViewbox:
		| { minX: number; maxX: number; minY: number; maxY: number }
		| undefined,
) {
	const { app, isInitialised } = useApplication();

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (viewportRef.current && initialViewbox && isInitialised) {
			app.renderer.events.domElement.oncontextmenu = (event) =>
				event.preventDefault();

			const viewbox = new Rectangle(
				-initialViewbox.minX,
				-initialViewbox.minY,
				initialViewbox.maxX - initialViewbox.minX,
				initialViewbox.maxY - initialViewbox.minY,
			);

			const targetScale = Math.min(
				app.renderer.events.domElement.clientWidth / viewbox.width,
				app.renderer.events.domElement.clientHeight / viewbox.height,
			);

			if (
				app.renderer.events.domElement.clientWidth / viewbox.width >
				app.renderer.events.domElement.clientHeight / viewbox.height
			) {
				viewbox.width =
					(viewbox.width * app.renderer.events.domElement.clientHeight) /
					viewbox.height;
				viewbox.height = app.renderer.events.domElement.clientHeight;
			} else {
				viewbox.height =
					(viewbox.height * app.renderer.events.domElement.clientWidth) /
					viewbox.width;
				viewbox.width = app.renderer.events.domElement.clientWidth;
			}

			viewportRef.current.scale.set(targetScale);
			viewportRef.current.position.copyFrom(
				new Point(
					viewbox.x * targetScale +
						(app.renderer.events.domElement.clientWidth - viewbox.width) / 2,
					viewbox.y * targetScale +
						(app.renderer.events.domElement.clientHeight - viewbox.height) / 2,
				),
			);
		}
	}, [isInitialised]);
}
