# Development Guide - Integration

## Prerequisites
- Node.js 22
- Yarn 4
- Browser binaries for Playwright
- Local Postgres (default integration config uses localhost)

## Setup
```sh
yarn install
yarn workspace @space/integration playwright install --with-deps
```

## Run Tests
```sh
yarn workspace @space/integration integrate
```

## Alternate Modes
```sh
yarn workspace @space/integration integrate:ui
yarn workspace @space/integration integrate:headed
```

## Notes
Playwright config starts backend and frontend servers automatically via `webServer` entries.
