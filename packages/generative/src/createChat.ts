import type z from "zod";

export async function createChat<T extends z.ZodObject>({
	messages,
	format,
}: {
	messages: {
		role: "user" | "system" | "tool" | "assistant";
		content: string;
	}[];
	format: T;
}) {
	const response = await fetch("http://192.168.128.1:11434/api/chat", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			model: "gemma3n",
			messages,
			stream: false,
			format,
		}),
	});

	const data = (await response.json()) as
		| { done: boolean; message: { role: string; content: string } }
		| undefined;

	if (!data?.done) {
		throw new Error("AI generation did not complete");
	}

	const parsed = format.safeParse(JSON.parse(data.message.content));

	if (!parsed.success) {
		console.error(parsed.error, data);
		throw new Error("AI generation did not produce valid output");
	}

	return parsed.data;
}
