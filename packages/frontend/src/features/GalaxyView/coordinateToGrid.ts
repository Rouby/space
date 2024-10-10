const domainPerLevel = [
	[
		["α", "β", "γ", "δ", "ε"],
		["ζ", "η", "θ", "ι", "κ"],
		["λ", "μ", "ν", "ξ", "ο"],
		["π", "ρ", "σ", "τ", "υ"],
		["φ", "χ", "ψ", "ω", "ඞ"],
	],
	[
		...Array.from({ length: 10 }, (_, i) =>
			Array.from(
				{ length: 10 },
				(_, j) => `${String.fromCharCode(65 + i)}${j}`,
			),
		),
	],
];

const maxLevel = 2;

export const gridSizes =
	[10000, 1000] ??
	Array.from({ length: maxLevel }, (_, level) => 100 * 2 ** (maxLevel - level));

export function coordinateToGrid(
	coordinate: { x: number; y: number },
	level: number,
): string {
	const offset = 20000;

	return Array.from({ length: level + 1 }, (_, level) => {
		const domain = domainPerLevel[level];
		const gridSize = gridSizes[level] ?? 1;

		const x = Math.floor(
			((coordinate.x + offset) %
				(gridSizes[level - 1] ?? Number.MAX_SAFE_INTEGER)) /
				gridSize,
		);
		const y = Math.floor(
			((coordinate.y + offset) %
				(gridSizes[level - 1] ?? Number.MAX_SAFE_INTEGER)) /
				gridSize,
		);

		return domain?.[y]?.[x] ?? `${x},${y}`;
	}).join(" ");
}

coordinateToGrid({ x: -24000, y: -24000 }, 2); //?
// coordinateToGrid({ x: -23000, y: -23000 }, 0); //?
