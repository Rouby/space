import { useApplication } from "@pixi/react";
import { Container, type EventSystem, Point, Rectangle } from "pixi.js";
import "pixi.js/math-extras";

export class Viewport extends Container {
	public rightclick: (data: { point: Point; shift: boolean }) => void;

	constructor({
		initialViewbox,
		events,
		rightclick,
	}: {
		initialViewbox?: { minX: number; maxX: number; minY: number; maxY: number };
		events: EventSystem;
		rightclick: (data: { point: Point; shift: boolean }) => void;
	}) {
		super();

		this.isRenderGroup = true;
		this.rightclick = rightclick;

		if (initialViewbox) {
			const viewbox = new Rectangle(
				-initialViewbox.minX,
				-initialViewbox.minY,
				initialViewbox.maxX - initialViewbox.minX,
				initialViewbox.maxY - initialViewbox.minY,
			);

			const targetScale = Math.min(
				events.domElement.clientWidth / viewbox.width,
				events.domElement.clientHeight / viewbox.height,
			);

			if (
				events.domElement.clientWidth / viewbox.width >
				events.domElement.clientHeight / viewbox.height
			) {
				viewbox.width =
					(viewbox.width * events.domElement.clientHeight) / viewbox.height;
				viewbox.height = events.domElement.clientHeight;
			} else {
				viewbox.height =
					(viewbox.height * events.domElement.clientWidth) / viewbox.width;
				viewbox.width = events.domElement.clientWidth;
			}

			this.scale.set(targetScale);
			this.position.copyFrom(
				new Point(
					viewbox.x * targetScale +
						(events.domElement.clientWidth - viewbox.width) / 2,
					viewbox.y * targetScale +
						(events.domElement.clientHeight - viewbox.height) / 2,
				),
			);

			// console.log(scale);
		}

		let dragging = false;
		const dragStart = new Point();

		events.domElement.addEventListener("mousedown", (event) => {
			dragging = true;
			events.mapPositionToPoint(dragStart, event.clientX, event.clientY);
		});
		events.domElement.addEventListener("mousemove", (event) => {
			if (dragging) {
				const point = new Point();
				events.mapPositionToPoint(point, event.clientX, event.clientY);
				const delta = point.subtract(dragStart);
				dragStart.copyFrom(point);

				this.position = this.position.add(delta);
			}
		});
		events.domElement.addEventListener("mouseup", () => {
			dragging = false;
		});
		events.domElement.addEventListener("wheel", (event) => {
			const point = new Point();
			events.mapPositionToPoint(point, event.clientX, event.clientY);

			const scale = 1 - event.deltaY * 0.001;

			this.position.set(
				point.x + (this.x - point.x) * scale,
				point.y + (this.y - point.y) * scale,
			);
			this.scale = this.scale.multiplyScalar(scale);
		});
		events.domElement.addEventListener("contextmenu", (event) => {
			event.preventDefault();

			this.rightclick({
				point: this.toLocal(events.pointer.global),
				shift: event.shiftKey,
			});
		});
	}
}

export function ViewportWrapper({
	initialViewbox,
	onRightClick,
	children,
}: {
	initialViewbox?: { minX: number; maxX: number; minY: number; maxY: number };
	onRightClick: (data: { point: Point; shift: boolean }) => void;
	children: React.ReactNode;
}) {
	const { app, isInitialised } = useApplication();

	if (!isInitialised) return null;

	return (
		<viewport
			initialViewbox={initialViewbox}
			events={isInitialised ? app.renderer.events : undefined}
			rightclick={onRightClick}
		>
			{children}
		</viewport>
	);
}
