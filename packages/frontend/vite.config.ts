import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import codegen from "vite-plugin-graphql-codegen";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
	plugins: [
		...(command === "build" ? [] : [TanStackRouterVite(), codegen()]),
		react({
			plugins: [
				// [
				// 	"@graphql-codegen/client-preset-swc-plugin",
				// 	{ artifactDirectory: "./src/gql", gqlTagName: "graphql" },
				// ],
			],
		}),
	],
	server: {
		proxy: {
			"/graphql": {
				target: "http://localhost:3000",
				changeOrigin: true,
			},
		},
	},
	build: {
		sourcemap: true,
	},
}));
