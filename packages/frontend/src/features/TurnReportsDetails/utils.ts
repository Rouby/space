export function formatProjectType(projectType: string) {
	return projectType
		.split("_")
		.map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
		.join(" ");
}

export function numberFromValue(value: string | number) {
	return Number(value);
}
