# Development Guide - Backend

## Prerequisites
- Node.js 22
- Yarn 4
- PostgreSQL reachable by configured connection string

## Setup
```sh
yarn install
```

## Run Locally
```sh
yarn workspace @space/backend dev
```

## Type Check
```sh
yarn workspace @space/backend typecheck
```

## Test
```sh
yarn workspace @space/backend test
```

## Notes
- Development server uses `nodemon` with `tsx` and optional `.env` loading.
- Backend watches its own schema files and selected gameloop files.
