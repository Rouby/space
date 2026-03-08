const formatterNumber = new Intl.NumberFormat(undefined, {
	notation: "compact",
	compactDisplay: "long",
});

export function formatNumber(input: number) {
	return formatterNumber.format(input);
}

const formatterInteger = new Intl.NumberFormat(undefined, {
	notation: "standard",
	maximumFractionDigits: 0,
});

export function formatInteger(input: number) {
	return formatterInteger.format(input);
}

const formatterUnit = new Intl.NumberFormat(undefined, {
	notation: "compact",
	compactDisplay: "short",
});

export function formatUnit(input: number) {
	return formatterUnit.format(input);
}

const formatterUnitPerRound = new Intl.NumberFormat(undefined, {
	notation: "standard",
	compactDisplay: "short",
});

const formatterRoundCount = new Intl.NumberFormat(undefined, {
	maximumFractionDigits: 1,
});

export function formatUnitPerRound(valuePerRound: number) {
	return `${formatterUnitPerRound.format(valuePerRound)}/round`;
}

export function formatRoundsToRelativeRounds(rounds: number) {
	if (!Number.isFinite(rounds) || rounds <= 0) {
		return "<1 round";
	}

	if (rounds < 1) {
		return "<1 round";
	}

	if (rounds < 10) {
		return `${formatterRoundCount.format(rounds)} rounds`;
	}

	return `${Math.ceil(rounds)} rounds`;
}
