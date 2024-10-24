import { useApplication } from "@pixi/react";
import {
	type Container,
	type FederatedPointerEvent,
	type FederatedWheelEvent,
	Point,
	Rectangle,
	Texture,
} from "pixi.js";
import "pixi.js/math-extras";
import { useEffect, useRef } from "react";

export function Viewport({
	initialViewbox,
	onClick,
	onRightClick,
	children,
}: {
	initialViewbox?: { minX: number; maxX: number; minY: number; maxY: number };
	onClick: (data: {
		event: Event;
		point: Point;
		shift: boolean;
	}) => void;
	onRightClick: (data: {
		event: Event;
		point: Point;
		shift: boolean;
	}) => void;
	children: React.ReactNode;
}) {
	const { app, isInitialised } = useApplication();
	const dragStart = useRef(new Point());
	const dragging = useRef(false);
	const viewportRef = useRef<Container>(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (viewportRef.current && initialViewbox && isInitialised) {
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

	if (!isInitialised) return null;

	return (
		<>
			<sprite
				texture={Texture.WHITE}
				width={app.screen.width}
				height={app.screen.height}
				tint={0x000000}
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
							shift: event.shiftKey,
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

					const scale = 1 - event.deltaY * 0.001;

					if (viewportRef.current) {
						viewportRef.current.position.set(
							point.x + (viewportRef.current.x - point.x) * scale,
							point.y + (viewportRef.current.y - point.y) * scale,
						);
						viewportRef.current.scale =
							viewportRef.current.scale.multiplyScalar(scale);
					}
				}}
			/>
			<container ref={viewportRef} isRenderGroup>
				{children}
			</container>
		</>
	);
}
