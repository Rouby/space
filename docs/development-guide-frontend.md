# Development Guide - Frontend

## Prerequisites
- Node.js 22
- Yarn 4

## Setup
```sh
yarn install
```

## Run Locally
```sh
yarn workspace @space/frontend dev
```

## Build
```sh
yarn workspace @space/frontend build
```

## Type Check
```sh
yarn workspace @space/frontend typecheck
```

## Notes
- Vite proxy forwards `/graphql` to backend on `localhost:3000`.
- GraphQL codegen files and router-generated files exist in this package.
