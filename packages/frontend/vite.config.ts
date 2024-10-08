import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import codegen from "vite-plugin-graphql-codegen";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
	plugins: [
		...(command === "build" ? [] : [TanStackRouterVite(), codegen()]),
		svgr(),
		react(),
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
