import { OutlineFilter } from "pixi-filters";

export function Sensors({
	sensors,
}: {
	sensors: {
		position: { x: number; y: number };
		sensorRange?: number | null;
	}[];
}) {
	return (
		<container
			filters={[
				new OutlineFilter({
					knockout: true,
					quality: 1,
					color: "blue",
					thickness: 2,
				}),
			]}
		>
			<graphics
				draw={(graphics) => {
					graphics.clear();
					graphics.setFillStyle({ color: "red" });
					for (const sensor of sensors) {
						if (sensor.sensorRange) {
							graphics.circle(
								sensor.position.x,
								sensor.position.y,
								sensor.sensorRange,
							);
						}
					}
					graphics.fill();
				}}
			/>
		</container>
	);
}
