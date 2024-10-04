import { GraphQLScalarType } from "graphql";
export const Vector = new GraphQLScalarType({
	name: "Vector",
	description: "Vector description",
	serialize: (value) => {
		return value;
	},
	parseValue: (value) => {
		/* Implement logic to parse input that was sent to the server as variables */
		if (
			typeof value === "object" &&
			value &&
			"x" in value &&
			"y" in value &&
			typeof value.x === "number" &&
			typeof value.y === "number"
		) {
			return value;
		}
	},
	parseLiteral: (ast) => {
		/* Implement logic to parse input that was sent to the server as literal values (string, number, or boolean) */
		return null;
	},
});
