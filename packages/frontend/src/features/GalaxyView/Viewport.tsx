import { useApplication } from "@pixi/react";
import { Container, type EventSystem, Point } from "pixi.js";
import "pixi.js/math-extras";

export class Viewport extends Container {
	public rightclick: (data: { point: Point; shift: boolean }) => void;

	constructor({
		events,
		rightclick,
	}: {
		events: EventSystem;
		rightclick: (data: { point: Point; shift: boolean }) => void;
	}) {
		super();

		this.isRenderGroup = true;
		this.rightclick = rightclick;

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
	onRightClick,
	children,
}: {
	onRightClick: (data: { point: Point; shift: boolean }) => void;
	children: React.ReactNode;
}) {
	const { app, isInitialised } = useApplication();

	if (!isInitialised) return null;

	return (
		<viewport
			events={isInitialised ? app.renderer.events : undefined}
			rightclick={onRightClick}
		>
			{children}
		</viewport>
	);
}
