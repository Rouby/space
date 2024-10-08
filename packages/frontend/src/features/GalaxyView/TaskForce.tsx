export function TaskForce({
	owner,
	selected,
	movementVector,
	onPointerDown,
}: {
	owner?: { color: string } | null;
	selected: boolean;
	movementVector?: { x: number; y: number } | null;
	onPointerDown: (event: React.PointerEvent) => void;
}) {
	return (
		<g>
			<circle
				r="5"
				fill={selected ? "yellow" : (owner?.color ?? "gray")}
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
