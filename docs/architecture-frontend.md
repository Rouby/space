# Architecture - Frontend

## Executive Summary
The frontend is a React 19 single-page app built with Vite and TanStack Router. It uses URQL for GraphQL communication and Mantine for UI composition.

## Technology Stack
- React 19 + TypeScript
- Vite 7 build/dev server
- TanStack Router
- URQL GraphQL client
- Mantine component ecosystem

## Architecture Pattern
Component-oriented SPA with route-based boundaries (`src/routes`) and feature modules (`src/features`).

## API Integration
- GraphQL endpoint proxy configured in `packages/frontend/vite.config.ts`.
- `/graphql` requests are proxied to backend localhost:3000 in local development.

## Component Structure
- Reusable components: `src/components`
- Domain features: `src/features`
- Routing and page boundaries: `src/routes`
- Theme setup: `src/theme`

## Development Notes
- Dev command: `yarn workspace @space/frontend dev`
- Build command: `yarn workspace @space/frontend build`
- Typecheck: `yarn workspace @space/frontend typecheck`
