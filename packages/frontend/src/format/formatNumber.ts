import dayjs from "dayjs";

const formatterNumber = new Intl.NumberFormat(undefined, {
	notation: "compact",
	compactDisplay: "long",
});

export function formatNumber(input: number) {
	return formatterNumber.format(input);
}

const formatterUnit = new Intl.NumberFormat(undefined, {
	notation: "compact",
	compactDisplay: "short",
});

export function formatUnit(input: number) {
	return formatterUnit.format(input);
}

const formatterUnitPerHour = new Intl.NumberFormat(undefined, {
	notation: "standard",
	compactDisplay: "short",
});

export function formatUnitPerTick(valuePerTick: number) {
	const ticksPerSecond = 1000 / 100;
	const input = valuePerTick * ticksPerSecond * 3600;

	return `${formatterUnitPerHour.format(input)}/h`;
}

export function formatTicksToRelativeTime(ticks: number) {
	const ticksPerSecond = 1000 / 100;
	const seconds = ticks / ticksPerSecond;

	return dayjs.duration(seconds, "seconds").humanize();
}
