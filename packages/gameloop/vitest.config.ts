import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		env: {
			DB_CONNECTION_STRING:
				"postgres://postgres:password@localhost:5432/testing",
		},
	},
});
