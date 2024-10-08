import { defineConfig } from "@eddeee888/gcg-typescript-resolver-files";
import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
	schema: "./src/**/schema.graphql",
	generates: {
		"./src/schema": defineConfig({
			typesPluginsConfig: { contextType: "../context#Context" },
			scalarsOverrides: {
				Vector: {
					type: "{x:number;y:number}",
				},
			},
			emitLegacyCommonJSImports: false,
			resolverGeneration: {
				query: "*",
				mutation: "*",
				subscription: "*",
				scalar: "*",
				object: "*",
				union: "",
				interface: "*",
				enum: "",
			},
		}),
	},
};

export default config;
