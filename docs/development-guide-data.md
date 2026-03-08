# Development Guide - Data

## Prerequisites
- Node.js 22
- Yarn 4
- PostgreSQL

## Setup
```sh
yarn install
```

## Commands
```sh
yarn workspace @space/data typecheck
yarn workspace @space/data drizzle-kit generate
yarn workspace @space/data drizzle-kit push
yarn workspace @space/data drizzle-kit studio
```

## Notes
- Main schema entry is `src/schema.ts`.
- Test and standard Drizzle configs are present.
