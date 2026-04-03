import type z from "zod";

export async function createCompletion<T extends z.ZodObject>({
	prompt,
	format,
}: {
	prompt: string;
	format: T;
}): Promise<z.infer<T>> {
	const response = await fetch("http://192.168.128.1:11434/api/generate", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			model: "gemma3n",
			prompt: prompt.replaceAll("\n", "\\n"),
			stream: false,
			format,
		}),
	});

	const data = (await response.json()) as
		| { done: boolean; response: string }
		| undefined;

	if (!data?.done) {
		console.error(data);
		throw new Error("AI generation did not complete");
	}

	const parsed = format.safeParse(JSON.parse(data.response));

	if (!parsed.success) {
		console.error(parsed.error, data);
		throw new Error("AI generation did not produce valid output");
	}

	return parsed.data;
}
