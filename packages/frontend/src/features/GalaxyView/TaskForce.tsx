import { OutlineFilter } from "pixi-filters";
import { Color, type Graphics, type PointData } from "pixi.js";
import { useCallback } from "react";

export function TaskForce({
	id,
	position,
	isVisible,
	isSelected,
	ownerColor,
	onClick,
	sensorRange,
}: {
	id: string;
	position: PointData;
	isVisible: boolean;
	isSelected?: boolean;
	ownerColor?: string | null;
	onClick: (id: string) => void;
	sensorRange?: number | null;
}) {
	const color = isVisible
		? (ownerColor ?? "white")
		: ownerColor
			? new Color(ownerColor).multiply(0.5).toHex()
			: "gray";

	const drawCircle = useCallback(
		(graphics: Graphics) => {
			graphics.clear();
			graphics.setFillStyle({ color });
			graphics.circle(0, 0, 10);
			graphics.fill();
		},
		[color],
	);

	const drawSensorRange = useCallback(
		(graphics: Graphics) => {
			graphics.clear();
			graphics.setStrokeStyle({ color: 0x0000ff, width: 2 });
			graphics.circle(0, 0, sensorRange ?? 0);
			graphics.stroke();
		},
		[sensorRange],
	);

	const onPointerUp = useCallback(() => {
		onClick(id);
	}, [onClick, id]);

	return (
		<container position={position}>
			<graphics
				draw={drawCircle}
				interactive
				cursor="pointer"
				onPointerUp={onPointerUp}
				filters={
					isSelected
						? [
								new OutlineFilter({
									quality: 1,
									color: "blue",
									thickness: 3,
								}),
							]
						: []
				}
			/>
			{(sensorRange ?? 0) > 0 && isSelected && (
				<graphics draw={drawSensorRange} />
			)}
		</container>
	);
}
