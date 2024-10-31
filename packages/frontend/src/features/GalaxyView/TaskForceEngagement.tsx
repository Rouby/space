import type { FederatedPointerEvent, PointData } from "pixi.js";

export function TaskForceEngagement({
	id,
	position,
	onClick,
	onRightClick,
}: {
	id: string;
	position: PointData;
	onClick: (event: FederatedPointerEvent) => void;
	onRightClick?: (event: FederatedPointerEvent) => void;
}) {
	return (
		<container position={position}>
			<graphics
				draw={(graphics) => {
					graphics.clear();
					graphics.setFillStyle({ color: "hotpink" });
					graphics.circle(0, 0, 15);
					graphics.fill();
				}}
				interactive
				cursor="pointer"
				onPointerTap={onClick}
				onRightClick={onRightClick}
			/>
		</container>
	);
}
