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

Each resource must also have 1-3 stat bonuses (statBonuses) that represent manufacturing bonuses when used in ship component construction. The modifier values are percentage multipliers (e.g. 0.08 = +8%).

Use these stat pools based on resource kind:
 * metal: armorThickness, structuralIntegrity (2-12% each)
 * crystal: weaponDamage, sensorPrecision, weaponAccuracy (2-12% each)
 * gas: ftlSpeed, thruster, powerGeneration (2-12% each)
 * liquid: shieldStrength, supplyCapacity (2-12% each)
 * biological: crewCapacity (2-12%)

Common resources (high discoveryWeight) should have small bonuses (2-5%). Rare resources (low discoveryWeight) should have larger bonuses (8-12%).

Be sure to generate atleast 3 random resources PER kind, more if you are feeling lucky.

Return a JSON object with a single property "resources" which is an array of these resources, each with name, kind, description, discoveryWeight, and statBonuses.
`,
	format: z.object({
		resources: z.array(
			z.object({
				name: z.string(),
				kind: z.enum(["metal", "crystal", "gas", "liquid", "biological"]),
				description: z.string(),
				discoveryWeight: z.int().min(1).max(100),
				statBonuses: z.array(
					z.object({
						stat: z.string(),
						modifier: z.number().min(0.01).max(0.2),
					}),
				),
			}),
		),
	}),
};
