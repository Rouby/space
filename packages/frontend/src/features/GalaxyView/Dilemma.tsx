import type { FederatedPointerEvent, Graphics, PointData } from "pixi.js";
import { useCallback } from "react";

export function Dilemma({
	title,
	position,
	onClick,
}: {
	id: string;
	title: string;
	position: PointData;
	onClick: (event: FederatedPointerEvent) => void;
}) {
	const drawCircle = useCallback((graphics: Graphics) => {
		graphics.clear();
		graphics.setFillStyle({ color: "00ff00" });
		graphics.circle(0, 0, 20);
		graphics.fill();
	}, []);

	return (
		<container position={position}>
			<graphics
				draw={drawCircle}
				interactive
				cursor="pointer"
				onPointerTap={onClick}
			/>
		</container>
	);
}
