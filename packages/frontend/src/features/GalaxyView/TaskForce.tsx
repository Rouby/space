export function TaskForce({
	selected,
	movementVector,
	onPointerDown,
}: {
	selected: boolean;
	movementVector?: { x: number; y: number } | null;
	onPointerDown: (event: React.PointerEvent) => void;
}) {
	return (
		<g>
			<circle
				r="5"
				fill={selected ? "yellow" : "red"}
				onPointerDown={onPointerDown}
			/>
			{movementVector && (
				<line
					x1="0"
					y1="0"
					x2={movementVector.x * 10}
					y2={movementVector.y * 10}
					stroke="white"
					strokeWidth="1"
					strokeDasharray="3 2"
				/>
			)}
		</g>
	);
}
