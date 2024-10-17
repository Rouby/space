import dayjs from "dayjs";

const formatterUnit = new Intl.NumberFormat(undefined, {
	style: "unit",
	unit: "gram",
	unitDisplay: "short",
	notation: "compact",
});

export function formatUnit(input: number) {
	return formatterUnit.format(input).replace("g", "units");
}

const formatterUnitPerHour = new Intl.NumberFormat(undefined, {
	style: "unit",
	unit: "gram-per-hour",
	unitDisplay: "long",
	notation: "standard",
});

export function formatUnitPerTick(valuePerTick: number) {
	const ticksPerSecond = 1000 / 100;
	const input = valuePerTick * ticksPerSecond * 3600;

	return formatterUnitPerHour.format(input).replace("grams", "units");
}

export function formatTicksToRelativeTime(ticks: number) {
	const ticksPerSecond = 1000 / 100;
	const seconds = ticks / ticksPerSecond;

	return dayjs.duration(seconds, "seconds").humanize();
}
