# Architecture - Integration

## Executive Summary
The integration package runs end-to-end validation using Playwright and orchestrates dependent services for tests.

## Technology Stack
- Playwright test runner
- Node.js scripts for DB preparation
- Workspace-level startup commands for backend/frontend

## Architecture Pattern
Test harness package with global setup/teardown, fixture support, and browser tests in `tests/`.

## Runtime Orchestration
`playwright.config.ts` defines two `webServer` entries:
- Backend startup and test DB push
- Frontend startup on strict port

## Development Notes
- Main command: `yarn workspace @space/integration integrate`
- Alternate modes: `integrate:ui`, `integrate:headed`
