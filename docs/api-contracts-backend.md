# API Contracts - Backend

## API Style
- Protocol: GraphQL over HTTP
- Runtime: Node.js (TypeScript)
- Server library: `graphql-yoga`
- Endpoint path: `/graphql` (frontend dev proxy target)

## Schema Modules (Quick Scan)
The backend schema is split into domain modules:
- `packages/backend/src/schema/base/schema.graphql`
- `packages/backend/src/schema/game/schema.graphql`
- `packages/backend/src/schema/user/schema.graphql`
- `packages/backend/src/schema/starSystem/schema.graphql`
- `packages/backend/src/schema/taskForce/schema.graphql`
- `packages/backend/src/schema/resource/schema.graphql`
- `packages/backend/src/schema/dilemma/schema.graphql`
- `packages/backend/src/schema/shipComponent/schema.graphql`
- `packages/backend/src/schema/shipDesign/schema.graphql`

## Resolvers and Entry Areas
- Entry point: `packages/backend/src/main.ts`
- Resolver roots include `Query`, `Mutation`, and `Subscription` folders under module resolvers.
- Example auth/token mutation resolver file: `packages/backend/src/schema/user/resolvers/Mutation/token.ts`

## Authentication and Session Notes
- JWT-oriented packages are present: `jose`, `@graphql-yoga/plugin-jwt`.
- Password hashing package present: `bcrypt`.
- Cookie plugin present: `@whatwg-node/server-plugin-cookies`.

## Contract Completeness
This document was generated in quick-scan mode (pattern/config based). For field-level request/response schemas and auth rules per operation, run deep or exhaustive scan.
