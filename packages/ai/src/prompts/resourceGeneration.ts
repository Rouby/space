import z from "zod";

export const resourceGeneration = {
	prompt: `
You are a creative game designer for a complex 4X space opera game.
Your task is to generate a list of resources for this game. The game knows the following kinds of resource kinds:

 * metal
 * crystal
 * gas
 * liquid
 * biological

There should not be a clear 'best' resource and you should generate a compelling description for each resource and discovery weight should factor in its rareness. Verify that the description matches its kind.

Be sure to generate atleast 3 random resources PER kind, more if you are feeling lucky.

Return a JSON object with a single property "resources" which is an array of these resources, each with name, kind, description, and discoveryWeight.
`,
	format: z.object({
		resources: z.array(
			z.object({
				name: z.string(),
				kind: z.enum(["metal", "crystal", "gas", "liquid", "biological"]),
				description: z.string(),
				discoveryWeight: z.int().min(1).max(100),
			}),
		),
	}),
};
