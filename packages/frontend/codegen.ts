import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
	schema: "../backend/src/**/schema.graphql",
	documents: ["./src/**/*.ts", "./src/**/*.tsx"],
	generates: {
		"./src/gql/": {
			preset: "client",
			config: {
				scalars: {
					Vector: "{x:number;y:number}",
					BigInt: "number",
				},
			},
		},
		"./src/gql/introspection.json": { plugins: ["urql-introspection"] },
	},
};

export default config;
