import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
	testDir: "./tests",
	/* Run tests in files in parallel */
	fullyParallel: true,
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: !!process.env.CI,
	/* Retry on CI only */
	retries: process.env.CI ? 2 : 0,
	/* Opt out of parallel tests on CI. */
	workers: process.env.CI ? 1 : undefined,
	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	reporter: "html",
	/* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
	use: {
		/* Base URL to use in actions like `await page.goto('/')`. */
		baseURL: "http://localhost:5173",

		/* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
		trace: "on-first-retry",

		screenshot: "only-on-failure",

		video: "retain-on-failure",
	},

	globalSetup: "./global-setup.ts",
	globalTeardown: "./global-teardown.ts",

	/* Configure projects for major browsers */
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],

	/* Run your local dev server before starting the tests */
	webServer: [
		{
			command:
				"yarn prepare:db && yarn --cwd ../.. db:push --config=drizzle.config.test.ts && yarn --cwd ../.. dev:backend",
			port: 3000,
			timeout: 120 * 1000,
			reuseExistingServer: !process.env.CI,
			env: {
				DB_CONNECTION_STRING:
					"postgres://postgres:password@localhost:5432/testing",
			},
			stdout: !process.env.CI ? "pipe" : "ignore",
			stderr: "pipe",
		},
		{
			command:
				"yarn --cwd ../.. dev:frontend --host 0.0.0.0 --port 5173 --strictPort",
			port: 5173,
			timeout: 120 * 1000,
			reuseExistingServer: !process.env.CI,
			stdout: !process.env.CI ? "pipe" : "ignore",
			stderr: "pipe",
		},
	],
});
