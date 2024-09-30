import { defineConfig } from "@eddeee888/gcg-typescript-resolver-files";
import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
	schema: "**/schema.graphql",
	documents: ["./src/**/*.tsx"],
	// ignoreNoDocuments: true,
	generates: {
		"./src/schema": defineConfig({
			typesPluginsConfig: { contextType: "graphql-yoga#YogaInitialContext" },
		}),
		"./src/gql/": { preset: "client" },
		"./src/gql/introspection.json": { plugins: ["urql-introspection"] },
	},
};

export default config;
